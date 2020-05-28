const companyResolver = require("../resolvers/companyResolver");

const fakeCompanyData = { name: "CompanyName", companySize: "A" };
// We don't need to test actual Prisma, hence this.
const prisma = {
  $exists: { company: jest.fn(() => true) },
  companies: jest.fn(() => ({ data: { companies: [fakeCompanyData] } })),
  company: jest.fn(() => ({ data: { company: fakeCompanyData } })),
};

describe("Company endpoints", () => {
  describe("company() -> single company endpoint", () => {
    const company = jest.spyOn(companyResolver.Query, "company");

    it("throws error when args.id is falsy (not provided)", async () => {
      const params = [{}, { id: 0 }, { prisma }, {}]; // falsy id: 0
      const request = async () => await company(...params);

      await expect(() => request()).rejects.toThrow("id is required");
      expect(prisma.$exists.company).not.toHaveBeenCalled();
      expect(prisma.company).not.toHaveBeenCalled();
    });

    it("returns company object when args.id provided", async () => {
      const params = [{}, { id: 1 }, { prisma }, {}];
      const request = async () => await company(...params);
      const companyData = await request();

      await expect(companyData).toEqual(
        expect.objectContaining({
          data: { company: fakeCompanyData },
        })
      );

      expect(prisma.$exists.company).toHaveBeenCalledTimes(1);
      expect(prisma.company).toHaveBeenCalledTimes(1);
    });
  });
});