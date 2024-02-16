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

    beforeEach(() => {
        // Clear all mocks before each test
        mockedNavigate.mockClear();
    });

    test("validates orgCode field correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        // Attempt to submit the form with orgCode empty
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        expect(await screen.findByText(/orgCode is required./)).toBeInTheDocument();
    
        // Input value exceeding maxLength
        fireEvent.change(screen.getByTestId(`${testId}-orgCode`), { target: { value: 'a'.repeat(31) } });
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        expect(await screen.findByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    test("validates orgTranslationShort field correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        // Leaving orgTranslationShort empty
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        expect(await screen.findByText(/orgTranslationShort is required./)).toBeInTheDocument();
    
        // Input value exceeding maxLength
        fireEvent.change(screen.getByTestId(`${testId}-orgTranslationShort`), { target: { value: 'a'.repeat(31) } });
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        expect(await screen.findByText(/Max length 30 characters/)).toBeInTheDocument();
    });

    test("validates orgTranslation field correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        // Attempt to submit the form with orgTranslation empty
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        expect(await screen.findByText(/orgTranslation is required./)).toBeInTheDocument();
    });

    test("validates inactive checkbox correctly", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        // Assuming the form requires the 'inactive' checkbox to be checked for submission
        // This test simulates not interacting with the checkbox and checking for a validation message
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        // Replace the following expectation with your actual validation message, if any
        // Note: Standard HTML forms do not support 'required' validation for checkboxes in this manner
        expect(await screen.findByText(/inactive state is required./)).toBeInTheDocument();
    
        // Now simulate checking the checkbox and submitting again
        fireEvent.click(screen.getByTestId(`${testId}-inactive`));
        fireEvent.submit(screen.getByRole('button', { name: /Create/ }));
        // You might want to check here that no validation error is shown, or that the form submission proceeds as expected
    });
    

    test("submit button has correct testId and can be clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
    
        const submitButton = screen.getByTestId(`${testId}-submit`);
        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);
        // You can add further assertions here to ensure clicking the submit button has the intended effect,
        // such as triggering form validation.
    });
    
    
    

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        // Adjust these label texts to match your actual form labels
        expect(screen.getByLabelText(/org Code/)).toBeInTheDocument();
        expect(screen.getByLabelText(/org Translation Short/)).toBeInTheDocument();
        expect(screen.getByLabelText(/org Translation Long/)).toBeInTheDocument(); // Corrected based on your component structure
        expect(screen.getByLabelText(/inactive/)).toBeInTheDocument(); // Ensure this matches case and text exactly
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

        // Checks that inputs are populated with initialContents values
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

    // Additional tests to cover validation and error message display could be added here
    // Example: Testing input validation for 'orgCode' being required and maxLength
});