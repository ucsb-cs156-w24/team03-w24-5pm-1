import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /MenuItemReview", async () => {

        const queryClient = new QueryClient();
        const menuItemReview = {
            id: 2,
            itemId: 101,
            reviewerEmail: "jhinckley@ucsb.edu",
            stars: 0,
            dateReviewed: "1981-03-30T14:27:00",
            comments: "I don't like jellybeans"
        };

        axiosMock.onPost("/api/MenuItemReview/post").reply(202, menuItemReview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("MenuItemReviewForm-itemId")).toBeInTheDocument();
        });

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '101' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'jhinckley@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '0' } });
        fireEvent.change(dateReviewedField, { target: { value: '1981-03-30T14:27:00' } });
        fireEvent.change(commentsField, { target: { value: 'I don\'t like jellybeans' } });


        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "comments": "I don't like jellybeans",
                "dateReviewed": "1981-03-30T14:27",
                "stars": "0",
                "reviewerEmail": "jhinckley@ucsb.edu",
                "itemId": "101"
        });

        expect(mockToast).toBeCalledWith("New menu item review Created - id: 2 itemId: 101");
        expect(mockNavigate).toBeCalledWith({ "to": "/MenuItemReview" });

    });
});


