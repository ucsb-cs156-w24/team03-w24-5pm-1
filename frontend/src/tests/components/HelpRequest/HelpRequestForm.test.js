import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Requester Email", "Team ID","Table Or Breakout Room","Request Time ISO Format", "Explanation"];
    const testId = "HelpRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });


    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();

        
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required/);
        expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
        expect(screen.getByText(/Table Or Breakout Room is required/)).toBeInTheDocument();
        expect(screen.getByText(/Request time is required and must be provided in ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();

    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-teamId");
        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(teamIdField, { target: { value: 'f11-5am-1 xyz' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester email must be a valid email./);
        expect(screen.getByText(/Team ID must be a valid team id./)).toBeInTheDocument();

        fireEvent.change(requesterEmailField, { target: { value: '*my email is john@example.com' } });
        fireEvent.change(teamIdField, { target: { value: 'f11-13am-1' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester email must be a valid email./);
        expect(screen.getByText(/Team ID must be a valid team id./)).toBeInTheDocument();

        fireEvent.change(requesterEmailField, { target: { value: 'user@example.com123' } });
        fireEvent.change(teamIdField, { target: { value: 'abc f11-12am-1' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Requester email must be a valid email./);
        expect(screen.getByText(/Team ID must be a valid team id./)).toBeInTheDocument();
    });
    
    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("HelpRequestForm-teamId");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 'w22-5pm-4' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '7' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(explanationField, { target: { value: 'Need help with Swagger-ui' } });
        fireEvent.click(solvedField);
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Requester email must be a valid email./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Team ID must be a valid team id./)).not.toBeInTheDocument();

    });
});


