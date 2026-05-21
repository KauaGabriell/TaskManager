const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  team: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  teamMember: {
    findUniqueOrThrow: jest.fn(),
  },
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
  taskHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(async (operations: Promise<unknown>[]) => Promise.all(operations)),
};

function resetPrismaMock() {
  for (const value of Object.values(prismaMock)) {
    if (typeof value === "function") {
      (value as jest.Mock).mockReset();
      continue;
    }

    for (const nestedValue of Object.values(value)) {
      if (typeof nestedValue === "function") {
        (nestedValue as jest.Mock).mockReset();
      }
    }
  }

  prismaMock.$transaction.mockImplementation(async (operations: Promise<unknown>[]) =>
    Promise.all(operations),
  );
}

export { prismaMock, resetPrismaMock };
