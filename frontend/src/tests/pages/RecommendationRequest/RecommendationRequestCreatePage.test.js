import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequest CreatePage test", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        // jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const recRequest = {
            "id": 1,
            "requesterEmail": "request1@ucsb.edu",
            "professorEmail": "prof@ucsb.edu",
            "explanation": "i want",
            "dateRequested": "2023-02-03T00:00",
            "dateNeeded": "2023-02-04T00:00",
            "done": true
        };

        axiosMock.onPost("/api/RecommendationRequest/post").reply(202, recRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
        

        fireEvent.change(requesterEmailField, { target: { value: 'request1@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'prof@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'i want' } });
        fireEvent.change(dateRequestedField, { target: { value: '2023-02-03T00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2023-02-04T00:00' } });
        fireEvent.change(doneField, { target: { value: true } })

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);
        
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail": "request1@ucsb.edu",
                "professorEmail": "prof@ucsb.edu",
                "explanation": "i want",
                "dateRequested": "2023-02-03T00:00",
                "dateNeeded": "2023-02-04T00:00",
                "done": "true"
        });

        expect(mockToast).toBeCalledWith(`New RecommendationRequest Created - id: ${recRequest.id}, explanation: ${recRequest.explanation}`);
        expect(mockNavigate).toBeCalledWith({ "to": "/RecommendationRequest" });
    });

});