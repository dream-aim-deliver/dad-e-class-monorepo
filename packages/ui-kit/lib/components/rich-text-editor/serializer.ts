
const slateToString = (slateData) => {
    if (!slateData || (Array.isArray(slateData) && slateData.length === 0)) {
      return JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]);
    }
    return JSON.stringify(slateData);
  };

const stringToSlate = (stringData) => {
    if (!stringData || stringData === "" || stringData === "null" || stringData === "undefined") {
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
    try {
      const parsed = JSON.parse(stringData);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return [{ type: "paragraph", children: [{ text: "" }] }];
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing slate content:", error);
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
  };

  export { slateToString, stringToSlate };