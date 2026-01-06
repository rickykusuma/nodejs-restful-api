import {
  createManyTestContact,
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from "./test-util.js";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });
  it("should can create new contacts", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        phone: "081231931913",
      });
    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("081231931913");
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "test",
        phone: "0812213333333333331931913",
      });
    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });
  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can get contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
  });
});

describe("PUT api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });
  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can update contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "Ricky",
        last_name: "Kusuma",
        email: "rickykusuma@gmail.com",
        phone: "081231931913",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("Ricky");
    expect(result.body.data.last_name).toBe("Kusuma");
    expect(result.body.data.email).toBe("rickykusuma@gmail.com");
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + 1)
      .set("Authorization", "test")
      .send({
        first_name: "Ricky",
        last_name: "Kusuma",
        email: "rickykusuma@gmail.com",
        phone: "081231931913",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });
  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can delete contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it("should reject if contact is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + 1)
      .set("Authorization", "test");
    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts/", () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });
  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it("should can search without parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .set("Authorization", "test")
      .send({});

    logger.info("result", result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });
  it("should can search to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });
  it("should can search using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "test 1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
  it("should can search using email", async () => {
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "test1",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
});
