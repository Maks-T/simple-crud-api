const fetch = require("node-fetch");
const { isValidBody } = require("./../src/controllers/utils/is-validy-body");

const baseUrl = "http://127.0.0.1:3000/person";

const w = "\x1b[37m";
const y = "\x1b[33m";

/* СЦЕНАРИЙ №1 */
// GET-запросом получаем все объекты (ожидается пустой массив)
// POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)
// GET-запросом пытаемся получить созданный объект по его id (ожидается созданный объект)
// PUT-запросом пытаемся обновить созданный объект (ожидается ответ, содержащий обновленный объект с тем же id)
// DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)
// GET - запросом пытаемся получить удаленный объект по id(ожидается ответ, что такого объекта нет)

describe(`${y}E2E tests SERVER: Сценарий №1 ${w}`, () => {
  let id;
  const mockPerson = {
    name: "Maxim",
    age: 32,
    hobbies: ["programming", "reading", "science"],
  };

  test("GET-запросом получаем все объекты (ожидается пустой массив)", async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  test("POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)", async () => {
    const response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockPerson),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    expect(data).toMatchObject(mockPerson);

    id = data.id;
  });

  test(`GET-запросом пытаемся получить созданный объект по его id (ожидается созданный объект)`, async () => {
    const response = await fetch(baseUrl + "/" + id);
    const data = await response.json();
    expect(data).toEqual({ id, ...mockPerson });
  });

  test("PUT-запросом пытаемся обновить созданный объект (ожидается ответ, содержащий обновленный объект с тем же id", async () => {
    const response = await fetch(baseUrl + "/" + id, {
      method: "PUT",
      body: JSON.stringify(mockPerson),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    expect(data).toEqual({ id, ...mockPerson });

    id = data.id;
  });

  test(`DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)`, async () => {
    const response = await fetch(baseUrl + "/" + id, { method: "DELETE" });
    const status = await response.status;
    expect(status).toBe(204);
  });

  test(`GET-запросом пытаемся получить удаленный объект по id (ожидается ответ, что такого объекта нет)`, async () => {
    const response = await fetch(baseUrl + "/" + id);
    const message = await response.json();
    expect(message).toEqual({
      message: `Error: Person with ID='${id}' not found`,
    });
  });
});

/* СЦЕНАРИЙ №2 */
// GET-запросом пытаемся получить объект по невалидному id (ожидается ошибка 400 и объект с сообщением об ошибке { message: "Error: Invalid ID person" })
// GET-запросом пытаемся получить объект по несуществующему id (ожидается ошибка 404 и объект с сообщением об ошибке { message: `Error: Person with ID='${id}' not found`)
// POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)
// POST-запросом создается новый объект без поля 'age' (ожидается ошибка 400 и объект с сообщением об ошибке {message: "Error: The body does not contain required properties"})
// DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)
// GET-запросом получаем все объекты (ожидается пустой массив)

describe(`${y}E2E tests SERVER: Сценарий №2 ${w}`, () => {
  let id = "dc375068-4ae6-11ec-81d3-0242ac130003";
  const mockPerson = {
    name: "ALeksey",
    age: 42,
    hobbies: ["fish", "animals", "woomen"],
  };

  test("GET-запросом пытаемся получить объект по невалидному id (ожидается ошибка 400 и объект с сообщением об ошибке { message: 'Error: 400 Invalid ID person' }", async () => {
    const response = await fetch(baseUrl + "/" + "invalidID");
    const message = await response.json();
    expect(response.status).toBe(400);
    expect(message).toEqual({ message: "Error: 400 Invalid ID person" });
  });

  test("GET-запросом пытаемся получить объект по несуществующему id (ожидается ошибка 404 и объект с сообщением об ошибке { message: `Error: 404 Person with ID='${id}' not found`)", async () => {
    const response = await fetch(baseUrl + "/" + id);
    const message = await response.json();
    expect(response.status).toBe(404);
    expect(message).toEqual({
      message: `Error: Person with ID='${id}' not found`,
    });
  });

  test("POST-запросом создается новый объект (ожидается ответ 201, содержащий свежесозданный объект)", async () => {
    const response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(mockPerson),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data).toMatchObject(mockPerson);

    id = data.id;
  });

  test("POST-запросом создается новый объект без поля 'age' (ожидается ошибка 400 и объект с сообщением об ошибке {message: 'Error: The body does not contain required properties'})", async () => {
    invalidPerson = { name: mockPerson.name, hobbies: mockPerson.hobbies };

    const response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(invalidPerson),
      headers: { "Content-Type": "application/json" },
    });

    const message = await response.json();
    expect(response.status).toBe(400);
    expect(message).toEqual({
      message: "Error: The body does not contain required properties",
    });
  });

  test(`DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)`, async () => {
    const response = await fetch(baseUrl + "/" + id, { method: "DELETE" });
    const status = await response.status;
    expect(status).toBe(204);
  });

  test("GET-запросом получаем все объекты (ожидается пустой массив)", async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    expect(data).toEqual([]);
  });
});

/* СЦЕНАРИЙ №3 */
// POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)
// PUT-запросом пытаемся обновить объект по невалидному id (ожидается ошибка 400 и объект с сообщением об ошибке { message: "Error: Invalid ID person" })
// PUT-запросом пытаемся обновить объект по несуществующему id (ожидается ошибка 404 и объект с сообщением об ошибке { message: `Error: Person with ID='${id}' not found`)
// DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)
// DELETE-запросом пытаемся удалить объект по тому же id (ожидается объект с сообщением об ошибке {message: `Error: 404 Person with ID='${id}' not found`})
