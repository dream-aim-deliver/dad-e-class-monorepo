import argparse
import os
import json
import logging
from typing import Dict, Any, List
from typing import TypeVar
from enum import Enum
from typing import NamedTuple
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Package(NamedTuple):
    name: str
    content: Dict[str, Any]
    dependencies: Dict[str, str]


class Strategy(Enum):
    WORKSPACE = 'workspace'
    EXPLICIT = 'explicit'


def getPackages(workspace_root: str) -> List[Package]:
    """
    Parses the subdirectories in the 'packages' folder within the given workspace root
    and returns a dictionary with the name of the package and the contents of the package.json file.

    Args:
        workspace_root (str): The root directory of the workspace.

    Returns:
        PackageDict: A dictionary where the keys are package names and the values are
                     the contents of the package.json file as dictionaries.
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
                    packages.append(Package(name=subdir, content=package_json, dependencies={}))

    return packages

def findWorkspaceDependencies(packages: List[Package]):
    """
    Finds and logs all dependencies in the packages that start with '@maany_shr/'.

    Args:
        packages (PackageDict): A dictionary where the keys are package names and the values are
                                the contents of the package.json file as dictionaries.
    """
    monorepo_packages = []
    for package in packages:
        package_content = package.content
        public_name = package_content.get('name', '')
        if public_name.startswith('@maany_shr/'):
            monorepo_packages.append(public_name)

    for package in packages:
        package_name = package.name
        package_content = package.content
        dependencies = package_content.get('dependencies', {})
        for dep_name in dependencies:
            if dep_name.startswith('@maany_shr/') and dep_name in monorepo_packages:
                logger.debug(f"Package '{package_name}' has a dependency on '{dep_name}'")
                package.dependencies[dep_name] = dependencies[dep_name]


def updateDependencies(packages: List[Package], strategy: Strategy, version: str | None = None):
    """
    Updates the dependencies of the packages based on the given strategy.

    Args:
        packages (List[Package]): A list of Package objects.
        strategy (Strategy): The update strategy to use.
        version (str, optional): The version to set for dependencies if the strategy is EXPLICIT.
    """
    for package in packages:
        for dep_name in package.dependencies:
            if strategy == Strategy.WORKSPACE:
                package.dependencies[dep_name] = "workspace:*"
            elif strategy == Strategy.EXPLICIT and version:
                package.dependencies[dep_name] = version
            else:
                logger.error(f"No version specified for EXPLICIT strategy for package '{package.name}'")
                raise ValueError("No version specified for EXPLICIT strategy!!")


def parse_arguments():
    parser = argparse.ArgumentParser(description='Update dependency versions.')
    parser.add_argument('--workspace-root', help='The root directory of the workspace.', default=os.getcwd())
    parser.add_argument('--strategy', choices=[strategy.value for strategy in Strategy], help='The update strategy to use.')
    parser.add_argument('--dry-run', action='store_true', help='Print the changes without modifying the files.')
    parser.add_argument('--verbose', action='store_true', help='Print debug information.')
    return parser.parse_args()

def main():
    args = parse_arguments()
    logger.info(f"Arguments: {args}")
    if args.verbose:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    
    workspace_root = args.workspace_root
    workspace_root = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    packages = getPackages(workspace_root)
    logger.info(f"Found {len(packages)} packages in the workspace: {', '.join([package.name for package in packages])}")
    logger.info(f"Workspace root: {workspace_root}")
    findWorkspaceDependencies(packages)
    logger.info([f"{package.name}: {package.dependencies}" for package in packages])
    logger.info(f"Updating dependencies using strategy: {args.strategy}")
    updateDependencies(packages, args.strategy, "workspace:*")
    logger.info([f"{package.name}: {package.dependencies}" for package in packages])
    
    # updateDependencies(packages, args.strategy)

if __name__ == '__main__':
    main()

