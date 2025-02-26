import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations"

export interface DummySkillsProps extends isLocalAware {
    skills: string[]
}

export const DummySkills = ({ skills, locale }: DummySkillsProps) => {
    const dictionary = getDictionary(locale);
    const title = dictionary.components.skills.title;

    return (
        <div>
            <h2>{title}</h2>
            <ul>
                {skills.map(skill => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>
        </div>
    )
}