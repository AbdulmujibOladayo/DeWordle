const fs = require("fs");
const path = require("path");
const { runBootstrap, DEV_PROFILES, copyEnvExampleIfMissing, getProfileDependencies } = require("./contributor-bootstrap");

// Mock fs and child_process
jest.mock("fs");
jest.mock("node:child_process", () => ({
  spawnSync: jest.fn(() => ({
    error: null,
    status: 0,
    stdout: "v20.10.0",
    stderr: "",
  })),
}));

describe("contributor-bootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DEV_PROFILES", () => {
    it("defines all required profiles", () => {
      const expectedProfiles = ["frontend-only", "indexer-only", "soroban-only", "full-stack"];
      expect(Object.keys(DEV_PROFILES)).toEqual(expect.arrayContaining(expectedProfiles));
    });

    it("each profile has required configuration", () => {
      for (const [profileName, config] of Object.entries(DEV_PROFILES)) {
        expect(config.description).toBeDefined();
        expect(config.dependencies).toBeInstanceOf(Array);
        expect(config.requiredEnvVars).toBeInstanceOf(Array);
        expect(config.installCommand).toBeDefined();
        expect(config.nextSteps).toBeInstanceOf(Array);
      }
    });
  });

  describe("runBootstrap", () => {
    it("returns error for unknown profile", () => {
      const result = runBootstrap("invalid-profile");
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Unknown profile");
      expect(result.availableProfiles).toEqual(Object.keys(DEV_PROFILES));
    });

    it("successfully runs bootstrap for frontend-only profile", () => {
      const result = runBootstrap("frontend-only");
      expect(result.ok).toBe(true);
      expect(result.profile).toBe("frontend-only");
      expect(result.description).toBe("Develop only the frontend application");
      expect(result.checks.length).toBe(DEV_PROFILES["frontend-only"].dependencies.length);
    });

    it("successfully runs bootstrap for indexer-only profile", () => {
      const result = runBootstrap("indexer-only");
      expect(result.ok).toBe(true);
      expect(result.profile).toBe("indexer-only");
      expect(result.checks.length).toBe(DEV_PROFILES["indexer-only"].dependencies.length);
    });

    it("successfully runs bootstrap for soroban-only profile", () => {
      const result = runBootstrap("soroban-only");
      expect(result.ok).toBe(true);
      expect(result.profile).toBe("soroban-only");
      expect(result.checks.length).toBe(DEV_PROFILES["soroban-only"].dependencies.length);
    });

    it("successfully runs bootstrap for full-stack profile (default)", () => {
      const result = runBootstrap();
      expect(result.ok).toBe(true);
      expect(result.profile).toBe("full-stack");
      expect(result.checks.length).toBe(DEV_PROFILES["full-stack"].dependencies.length);
    });
  });

  describe("copyEnvExampleIfMissing", () => {
    it("copies env example when target doesn't exist", () => {
      fs.existsSync.mockImplementation((path) => path.endsWith(".env.example"));
      fs.copyFileSync.mockImplementation(() => {});
      
      const result = copyEnvExampleIfMissing("/test/.env.example", "/test/.env.local");
      expect(result.copied).toBe(true);
      expect(fs.copyFileSync).toHaveBeenCalledWith("/test/.env.example", "/test/.env.local");
    });

    it("doesn't copy when target already exists", () => {
      fs.existsSync.mockReturnValue(true);
      fs.copyFileSync.mockImplementation(() => {});
      
      const result = copyEnvExampleIfMissing("/test/.env.example", "/test/.env.local");
      expect(result.copied).toBe(false);
      expect(result.exists).toBe(true);
      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });
  });

  describe("getProfileDependencies", () => {
    it("returns correct dependencies for frontend-only", () => {
      const checks = getProfileDependencies("frontend-only");
      expect(checks.length).toBe(2); // node, npm
      expect(checks.map(c => c.command)).toEqual(["node", "npm"]);
    });

    it("returns correct dependencies for full-stack", () => {
      const checks = getProfileDependencies("full-stack");
      expect(checks.length).toBe(6); // node, npm, rustc, cargo, docker, psql
      expect(checks.map(c => c.command)).toEqual(["node", "npm", "rustc", "cargo", "docker", "psql"]);
    });
  });
});