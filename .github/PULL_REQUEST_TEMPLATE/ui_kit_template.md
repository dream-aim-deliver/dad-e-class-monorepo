## Description

<!-- Provide a clear and concise description of the changes made in this pull request for UI-Kit components. -->

- Component name: `ComponentName`
- Figma link or screenshot: [Figma Design](https://www.figma.com/)

---


## React Best Practices Checklist

- [ ] I have avoided **unnecessary re-renders** by using composition (`children` as props), whenever possible. This applies, in particular, to composite components (like lists of components, and the like).
- [ ] **I have designed my components as server-side whenever possible**—I have not used `useState`, `useEffect`, `useContext`, or any other React hook that works with "use client" without a good reason.
- [ ] **I have not put props in state**—in general, props should remain as props unless the component needs an `initialValue`, and judiciously manage its own independent state detached from the parent component.
    - If I have stored props in state, I have explained where exactly and justified it with a solid reason here below:
    
- [ ] **I have avoided using Context** in any critical component in terms of performance
    - If I have used Context, I have explained where exactly and justified it with a solid reason here below:


## General Checklist

- [ ] I have run the lint, build, and test commands locally, as explained in the README, before creating this PR to ensure the code is clean and functional.
- [ ] My changes align with the **core models** that have been discussed and agreed upon.
- [ ] The component design has been compared to the **Figma design** to ensure consistency.
- [ ] The **component is fully responsive** and behaves as expected across different screen sizes.
- [ ] The component **supports keyboard web accessibility** (if applicable).
- [ ] I have written **unit tests** or **integration tests** to cover the component's functionality above the coverage threshold.
- [ ] I have updated the **documentation** for the component, including usage examples and guidelines.
- [ ] I have **commented** my code, particularly in complex or non-obvious areas.
- [ ] The **component is properly exported** for use in other parts of the application.




---

## Related Issues

<!-- Link any related issue or task. For example: -->
Fixes # (issue)

