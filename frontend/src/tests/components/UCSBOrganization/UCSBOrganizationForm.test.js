import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";   
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
    useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
    const queryClient = new QueryClient();
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();


        expect(screen.getByLabelText(/org Code/)).toBeInTheDocument();
        expect(screen.getByLabelText(/org Translation Short/)).toBeInTheDocument();
        expect(screen.getByLabelText(/org Translation Long/)).toBeInTheDocument();
        expect(screen.getByLabelText(/inactive/)).toBeInTheDocument();
    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization[0]} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();


        const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
        expect(orgCodeInput.value).toBe(ucsbOrganizationFixtures.oneOrganization[0].orgCode);

        const orgTranslationShortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        expect(orgTranslationShortInput.value).toBe(ucsbOrganizationFixtures.oneOrganization[0].orgTranslationShort);

        const orgTranslationInput = screen.getByTestId(`${testId}-orgTranslation`);
        expect(orgTranslationInput.value).toBe(ucsbOrganizationFixtures.oneOrganization[0].orgTranslation);

        const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
        expect(inactiveCheckbox.checked).toBe(ucsbOrganizationFixtures.oneOrganization[0].inactive);
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        const cancelButton = await screen.findByTestId(`${testId}-cancel`);
        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        const cancelButton = await screen.findByTestId(`${testId}-cancel`);
        fireEvent.click(cancelButton);
    
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

});
