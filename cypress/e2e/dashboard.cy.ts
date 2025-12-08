describe("Login Page UI Test", () => {
  beforeEach(
    "should allow user to type email, password and click Sign In",
    () => {
      cy.visit("http://localhost:5173");

      // Email input
      cy.get("input")
        .first()
        .type("test@gmail.com")
        .should("have.value", "test@gmail.com");

      // Password input
      cy.get('input[type="password"]').type("123").should("have.value", "123");

      // Click Sign In button
      cy.contains("button", "Sign In").click();
      cy.url().should("equal", "http://localhost:5173/dashboard");
    }
  );

  it("Dashboard tab should be selected by default", () => {
    cy.get(".header-center button[aria-selected=true]")
      .first()
      .should("have.text", "Dashboard");
  });

  it("Should filter by date range by default", () => {
    cy.get(".filter-tags > .tag").should("exist").should("have.length", "2");
  });

  it("Should switch to Upload File tab", () => {
    cy.contains("Upload File").click();

    cy.get(".header-center button[aria-selected=true]")
      .first()
      .should("have.text", "Upload File");
  });

  it("Should sort team member portfolio table", () => {
    cy.intercept("GET", "/api/Incident/nameandcountbypriority*").as(
      "getTeamMembers"
    );

    cy.wait("@getTeamMembers");
    cy.wait("@getTeamMembers");

    cy.get(".sortable", { timeout: 10000 }).first().click();

    cy.wait("@getTeamMembers").then(({ request }) => {
      expect(request.url).to.include("SortBy=totalCount&SortOrder=asc");
    });
  });
});
