from dataclasses import dataclass
import os
import json
import logging
import traceback
from typing import Dict, Any, List, Literal
from enum import Enum
from typing import NamedTuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Package:
    name: str
    content: Dict[str, Any]

@dataclass(frozen=True, slots=True)
class PackageWithDependencies(Package):
    dependencies: Dict[str, str]

class StrategyName(Enum):
    WORKSPACE = 'workspace'
    EXPLICIT = 'explicit'

class Strategy(NamedTuple):
    name: Literal[StrategyName.WORKSPACE, StrategyName.EXPLICIT]
    version: str | None

VALID_STRATEGIES = [strategy for strategy in StrategyName]


def getPackages(workspace_root: str) -> List[Package]:
    """
    Parses the subdirectories in the 'packages' folder within the given workspace root
    and returns a dictionary with the name of the package and the contents of the package.json file.

    Args:
        workspace_root (str): The root directory of the workspace.

    Returns:
        List[Package]: A list of Package objects, each containing the name and content of a package.
    """
    packages_dir = os.path.join(workspace_root, 'packages')
    packages: List[Package] = []

    for subdir in os.listdir(packages_dir):
        package_path = os.path.join(packages_dir, subdir)

        if os.path.isdir(package_path):
            package_json_path = os.path.join(package_path, 'package.json')

            if os.path.isfile(package_json_path):
                with open(package_json_path, 'r') as f:
                    package_json = json.load(f)
                    packages.append(Package(name=subdir, content=package_json)) 

    return packages


def findWorkspaceDependencies(packages: List[Package]) -> List[PackageWithDependencies]:
    """
    Finds the dependencies of the packages that are part of the workspace.

    Args:
        packages (List[Package]): A list of Package objects.

    Returns:
        List[PackageWithDependencies]: A list of PackageWithDependencies objects
    """
    monorepo_packages = []
    for package in packages:
        package_content = package.content
        public_name = package_content.get('name', '')
        if public_name.startswith('@maany_shr/'):
            monorepo_packages.append(public_name)

    result: List[PackageWithDependencies] = []
    for package in packages:

        package_name = package.name
        package_content = package.content
        dependencies_raw = package_content.get('dependencies', {})
        try:
            publish_config_access = package_content.get('publishConfig', {'access': ''}).get('access', '')
        except Exception as e:
            publish_config_access = ''

        dependencies = [dep_name for dep_name in dependencies_raw if dep_name.startswith('@maany_shr/') and dep_name in monorepo_packages]

        if dependencies and publish_config_access == 'public':
            result.append(PackageWithDependencies(
                name=package_name,
                content=package_content,
                dependencies={dep_name: dependencies_raw[dep_name] for dep_name in dependencies}
            ))

    return result


def updateDependencies(packages: List[Package], strategy: Strategy) -> List[Package]:
    """
    Updates the dependencies of the packages based on the given strategy.

    Args:
        packages (List[Package]): A list of Package objects.
        strategy (Strategy): The update strategy to use.
        dry_run (bool): Whether to perform a dry run or not.
    
    Returns:
        List[Package]: A list of Package objects with the dependencies updated.
    """



    for package in packages:

        for dep_name in package.dependencies:

            if strategy.name == StrategyName.WORKSPACE:
                logger.info(f"Will update dependency '{dep_name}' in package '{package.name}' from '{package.dependencies[dep_name]}' to 'workspace:*'")

                package.content['dependencies'][dep_name] = 'workspace:*'

            elif strategy.name == StrategyName.EXPLICIT and strategy.version:
                logger.info(f"Will update dependency '{dep_name}' in package '{package.name}' from '{package.dependencies[dep_name]}' to '{strategy.version}'")

                package.content['dependencies'][dep_name] = strategy.version
    
    return packages


def writePackages(packages: List[Package], workspace_root: str, dry_run: bool) -> None:
    """
    Writes the updated package.json files to disk.

    Args:
        packages (List[Package]): A list of Package objects with the dependencies updated.
        workspace_root (str): The root directory of the workspace.
        dry_run (bool): Whether to perform a dry run or not.
    
    Returns:
        None
    """
    
    if not dry_run:
        for package in packages:
            package_content = package.content

            package_path = os.path.join(workspace_root, 'packages', package.name, 'package.json')

            with open(package_path, 'w') as f:
                json.dump(package_content, f, indent=2)

        logger.info("Dependencies updated successfully.")

    else:
        # Dump the resulting package.json files to the console
        for package in packages:
            package_path = os.path.join(workspace_root, 'packages', package.name, 'package.json')
            logger.info(f"Dry run. Dump of package: '{package.name}', at '{package_path}'\n{json.dumps(package.content, indent=2)}")
            

def validate_inputs(workspace_root: str, strategy_name: StrategyName, version: str | None) -> None:

    if not workspace_root or not os.path.isdir(workspace_root):
        raise ValueError(f"A valid workspace root directory is needed. Found: '{workspace_root}'")

    if strategy_name not in VALID_STRATEGIES:
        raise ValueError(f"A valid strategy is needed. Found: '{strategy_name}'. Expected one of {', '.join([strategy.value for strategy in VALID_STRATEGIES])}")

    elif strategy_name == StrategyName.EXPLICIT and not version:
        raise ValueError(f"Strategy '{strategy_name}' requires a version to be set.")


def process_version(version_raw: str | None) -> str | None:
    """
    Processes the version string and returns a cleaned version string.
    """
    if version_raw:
        if version_raw.startswith('v'):
            version = version_raw[1:].strip()
        else:
            version = version_raw.strip()
        return version

    return None


def main(
    workspace_root: str,
    strategy_name: StrategyName,
    version: str | None,
    dry_run: bool = False,
    verbose: bool = False
) -> None:

    try:
        if verbose:
            logger.setLevel(logging.DEBUG)
        else:
            logger.setLevel(logging.INFO)
        
        version_processed = process_version(version)
        validate_inputs(workspace_root, strategy_name, version_processed)

        logger.info(f"Updating dependencies in the workspace at: {workspace_root}")
        packages = getPackages(workspace_root)

        logger.info(f"Found {len(packages)} packages in the workspace: {', '.join([package.name for package in packages])}")

        logger.info(f"Workspace root: {workspace_root}")
        packages_with_deps = findWorkspaceDependencies(packages)

        logger.info(f"The following packages have dependencies: " + " --- ".join([f"{package.name}: {package.dependencies}" for package in packages_with_deps]))

        logger.info(f"Updating dependencies using strategy: {strategy_name}")
        if dry_run:
            logger.info("Dry run enabled. No files will be modified.")
        strategy = Strategy(strategy_name, version_processed)
        updated_packages = updateDependencies(packages_with_deps, strategy)

        logger.info(f"Writing updated package.json files to disk.")
        writePackages(updated_packages, workspace_root, dry_run)

        logger.info("Done.")

    
    except Exception as e:
        error_message = f"An error occurred ::: {e.__class__.__name__} ::: {e}"
        traceback_message = f"{traceback.format_exc()}"
        logger.error(error_message)
        if verbose:
            logger.error(traceback_message)


def cli() -> None:

    import argparse

    parser = argparse.ArgumentParser(
        description=(
            "Update dependency versions.\n\n"
            "Example usage:\n"
            "  python3 update-dependency-versions.py -w /path/to/workspace -s workspace\n"
            "  python3 update-dependency-versions.py -w /path/to/workspace -s explicit -v 1.0.0\n"
            "  python3 update-dependency-versions.py -w /path/to/workspace -s explicit -v 1.0.0 -d --verbose"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        '-w',
        '--workspace-root',
        help='The root directory of the workspace.',
        required=True,
    )

    parser.add_argument(
        '-s',
        '--strategy',
        choices=[strategy.value for strategy in StrategyName], 
        help='The update strategy to use.',
        required=True,
    )

    parser.add_argument(
        '-v',
        '--version',
        help="The version to set for dependencies if the strategy is 'explicit'.",
        default=None
    )

    parser.add_argument(
        '-d',
        '--dry-run',
        action='store_true',
        help='Print the changes without modifying the files.',
        default=False
    )

    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print debug information.',
        default=False
    )

    args = parser.parse_args()

    logger.info(f"Arguments: {args}")

    main(
        workspace_root=args.workspace_root,
        strategy_name=StrategyName(args.strategy),
        version=args.version,
        dry_run=args.dry_run,
        verbose=args.verbose
    )


if __name__ == '__main__':
    cli()

