import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationTable tests", () => {
  const queryClient = new QueryClient();
  const testIdPrefix = "UCSBOrganizationTable";

  beforeEach(() => {
    mockedNavigate.mockReset();
  });

  test("renders table with headers correctly, even when empty", () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={[]} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    ["Org Code", "Org Translation Short", "Org Translation Long", "Inactive"].forEach(headerText => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  test("Ensures 'Edit' and 'Delete' buttons have correct styling", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const editButton = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-Edit-button`);
    const deleteButton = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-Delete-button`);
    expect(editButton).toHaveClass('btn-primary');
    expect(deleteButton).toHaveClass('btn-danger');
});


  test("Has the expected column headers and content for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    ["Org Code", "Org Translation Short", "Org Translation Long", "Inactive"].forEach(headerText => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-orgCode`)).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
    expect(screen.getByTestId(`${testIdPrefix}-cell-row-0-col-Edit-button`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testIdPrefix}-cell-row-0-col-Delete-button`)).toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const editButton = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-Edit-button`);
    fireEvent.click(editButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(`/ucsborganization/edit/LI`));
  });

  test("Does not render edit and delete buttons for non-admin user", async () => {
    const currentUser = currentUserFixtures.userOnly;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.queryByTestId(`${testIdPrefix}-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${testIdPrefix}-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
  });

  test("renders correctly using default testIdPrefix when not provided", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const header = await screen.findByText("Org Code");
    expect(header).toBeInTheDocument();

    const orgCodeElement = await screen.findByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode");
    expect(orgCodeElement).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgCode);
  });

  test("Displays data for orgTranslationShort, orgTranslation, and inactive correctly", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const orgTranslationShortCell = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-orgTranslationShort`);
    expect(orgTranslationShortCell).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslationShort);

    const orgTranslationCell = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-orgTranslation`);
    expect(orgTranslationCell).toHaveTextContent(ucsbOrganizationFixtures.threeOrganizations[0].orgTranslation);
  
    const expectedInactiveText = ucsbOrganizationFixtures.threeOrganizations[0].inactive ? "Yes" : "No";
    const inactiveCell = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-inactive`);
    expect(inactiveCell).toHaveTextContent(expectedInactiveText);
  });

  test("Displays 'Yes' for active organizations and 'No' for inactive ones correctly", async () => {
    const currentUser = currentUserFixtures.adminUser;
    render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
          </MemoryRouter>
        </QueryClientProvider>
      );
  
    const inactiveCellForInactiveOrg = await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-inactive`);
    expect(inactiveCellForInactiveOrg).toHaveTextContent("No");
  
    const inactiveCellForActiveOrg = await screen.findByTestId(`${testIdPrefix}-cell-row-1-col-inactive`);
    expect(inactiveCellForActiveOrg).toHaveTextContent("Yes");
  });

  
  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationTable  organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} testIdPrefix={testIdPrefix} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByTestId(`${testIdPrefix}-cell-row-0-col-orgCode`)).toHaveTextContent("LI");
    expect(screen.getByTestId(`${testIdPrefix}-cell-row-0-col-orgTranslationShort`)).toHaveTextContent("Los Ingenieros");
    expect(screen.getByTestId(`${testIdPrefix}-cell-row-0-col-orgTranslation`)).toHaveTextContent("Los Ingenieros SHPE UCSB");

    const deleteButton = screen.getByTestId(`${testIdPrefix}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
  });

});
