import { exportAllData, EXPORT_VERSION } from "../dataExport";
import { importData } from "../dataImport";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import {
  beanTable,
  beanTasteAssociationTable,
  beanTasteTable,
  roasteryTable,
} from "@/db/schema";

const createMockDb = (): ExpoSQLiteDatabase => {
  const mockData = {
    beans: [
      {
        id: 1,
        name: "Ethiopia Yirgacheffe",
        robustaAmount: 0,
        arabicaAmount: 100,
        roastery: 1,
        degreeOfGrinding: 8.5,
        singleShotDosis: 8.0,
        doubleShotDosis: 16.0,
        isFavorit: true,
        aromaFruity: 90,
        aromaFloral: 85,
        aromaSweet: 80,
        aromaNutty: 30,
        aromaSpices: 40,
        aromaRoasted: 50,
        aromaGreen: 20,
        aromaSour: 15,
        aromaOther: 10,
      },
    ],
    roasteries: [{ id: 1, name: "Counter Culture Coffee" }],
    tastes: [
      { id: 1, flavor: "Fruity" },
      { id: 2, flavor: "Floral" },
    ],
    associations: [
      { id: 1, beanId: 1, tasteId: 1 },
      { id: 2, beanId: 1, tasteId: 2 },
    ],
  };

  return {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockImplementation((table) => {
      const mock = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        prepare: jest.fn().mockReturnThis(),
      };

      if (table === beanTable) {
        return Promise.resolve(mockData.beans);
      }
      if (table === roasteryTable) {
        mock.where = jest
          .fn()
          .mockResolvedValue(mockData.roasteries.slice(0, 1));
        return mock;
      }
      if (table === beanTasteTable) {
        mock.where = jest.fn((condition) => {
          return Promise.resolve([mockData.tastes[0]]);
        });
        return mock;
      }
      if (table === beanTasteAssociationTable) {
        mock.where = jest.fn().mockResolvedValue(mockData.associations);
        return mock;
      }
      return mock;
    }),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 1 }]),
  } as unknown as ExpoSQLiteDatabase;
};

describe("Data Export/Import", () => {
  describe("exportAllData", () => {
    it("should export data with correct version and structure", async () => {
      const mockDb = createMockDb();
      const jsonData = await exportAllData(mockDb);
      const exportedData = JSON.parse(jsonData);

      expect(exportedData.version).toBe(EXPORT_VERSION);
      expect(exportedData.exportDate).toBeDefined();
      expect(exportedData.beans).toBeInstanceOf(Array);
    });

    it("should include all bean properties", async () => {
      const mockDb = createMockDb();
      const jsonData = await exportAllData(mockDb);
      const exportedData = JSON.parse(jsonData);

      const bean = exportedData.beans[0];
      expect(bean.name).toBe("Ethiopia Yirgacheffe");
      expect(bean.roasteryName).toBe("Counter Culture Coffee");
      expect(bean.singleShotDosis).toBe(8.0);
      expect(bean.doubleShotDosis).toBe(16.0);
      expect(bean.aromaFruity).toBe(90);
    });

    it("should include tastes array", async () => {
      const mockDb = createMockDb();
      const jsonData = await exportAllData(mockDb);
      const exportedData = JSON.parse(jsonData);

      const bean = exportedData.beans[0];
      expect(bean.tastes).toBeInstanceOf(Array);
      expect(bean.tastes.length).toBeGreaterThan(0);
    });
  });

  describe("importData", () => {
    it("should validate export version", async () => {
      const mockDb = createMockDb();
      const invalidData = JSON.stringify({
        version: "0.0.1",
        exportDate: new Date().toISOString(),
        beans: [],
      });

      const result = await importData(mockDb, invalidData);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject invalid JSON", async () => {
      const mockDb = createMockDb();
      const result = await importData(mockDb, "invalid json");

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle missing required fields", async () => {
      const mockDb = createMockDb();
      const invalidData = JSON.stringify({
        version: EXPORT_VERSION,
      });

      const result = await importData(mockDb, invalidData);
      expect(result.success).toBe(false);
    });
  });
});
