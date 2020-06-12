const therapeuticResolver = require("../resolvers/therapeuticResolver");

const dummyTherapeutic = {
  data: { therapeutic: { id: 1, name: "therapeutic" } },
};
const dummyTherapeutics = {
  data: {
    therapeutics: [
      { id: 1, name: "therapeutic 1" },
      { id: 2, name: "therapeutic 2 " },
    ],
  },
};

const prisma = {
  $exists: { therapeutic: jest.fn() },
  therapeutics: jest.fn(() => dummyTherapeutics),
  therapeutic: jest.fn(() => dummyTherapeutic),
  searchTherapeutics: jest.fn(() => dummyTherapeutics),
  createTherapeutic: jest.fn(() => dummyTherapeutic),
  updateTherapeutic: jest.fn(() => dummyTherapeutic),
  deletetherapeutic: jest.fn(() => dummyTherapeutic),
};

describe("Query", () => {
  const therapeutic = jest.spyOn(therapeuticResolver.Query, "therapeutic");
  const therapeutics = jest.spyOn(therapeuticResolver.Query, "therapeutics");
  const searchTherapeutics = jest.spyOn(
    therapeuticResolver.Query,
    "searchTherapeutics"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  const params = [{}, {}, { prisma }, {}];

  describe("therapeutics()", () => {
    it("calls prisma.therapeutics", () => {
      therapeutics(...params);

      expect(prisma.therapeutics).toHaveBeenCalled();
      expect(prisma.therapeutics).toHaveBeenCalledTimes(1);
    });
  });

  describe("therapeutic()", () => {
    it("calls prisma.therapeutic with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      therapeutic(...params);

      expect(prisma.therapeutic).toHaveBeenCalled();
      expect(prisma.therapeutic).toHaveBeenCalledTimes(1);
      expect(prisma.therapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
  describe("searchTherapeutics()", () => {
    const params = [{}, { search: "as" }, { prisma }, {}];

    it("throws an error if search length is less than 3 characters", async () => {
      const request = async () => await searchTherapeutics(...params);
      await expect(() => request()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.therapeutics).not.toHaveBeenCalled();
    });
  });
});

describe("Mutation", () => {
  const createTherapeutic = jest.spyOn(
    therapeuticResolver.Mutation,
    "createTherapeutic"
  );
  const updateTherapeutic = jest.spyOn(
    therapeuticResolver.Mutation,
    "updateTherapeutic"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTherapeutic()", () => {
    it("throws an error if there is a therapeutic area with same name", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => true);

      await expect(createTherapeutic(...params)).rejects.toThrow(
        `There is a therapeutic area named '${
          params[1].name
        }' already, please enter a different name.`
      );
      expect(prisma.createTherapeutic).not.toHaveBeenCalled();
    });

    it("calls prisma.createTherapeutic()", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => false);

      await createTherapeutic(...params);

      expect(prisma.createTherapeutic).toHaveBeenCalledTimes(1);
    });
  });
});
