import { describe, expect, it } from "vitest";

describe("Text-based sorting for filters", () => {
  it("sorts project titles alphabetically and naturally", () => {
    const projects = [
      { id: "3", title: "Project 10" },
      { id: "1", title: "Beta Project" },
      { id: "2", title: "Alpha Project" },
      { id: "4", title: "Project 2" },
      { id: "5", title: "项目B" },
      { id: "6", title: "项目A" },
    ];

    const sorted = [...projects].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" }),
    );

    expect(sorted.map((p) => p.title)).toEqual([
      "Alpha Project",
      "Beta Project",
      "Project 2",
      "Project 10",
      "项目A",
      "项目B",
    ]);
  });

  it("sorts label names alphabetically", () => {
    const labels = [
      { id: "1", name: "urgent" },
      { id: "2", name: "bug" },
      { id: "3", name: "frontend" },
      { id: "4", name: "后端" },
      { id: "5", name: "前端" },
    ];

    const sorted = [...labels].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
    );

    expect(sorted.map((l) => l.name)).toEqual([
      "bug",
      "frontend",
      "urgent",
      "前端",
      "后端",
    ]);
  });
});
