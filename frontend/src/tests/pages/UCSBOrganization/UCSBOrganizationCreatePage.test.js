import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
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

describe("UCSBOrganizationCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
        const org = {
            orgCode: "AS",
            orgTranslationShort: "Associated Students",
            orgTranslation: "Associated Students of UCSB",
            inactive: true
        };

        axiosMock.onPost("/api/ucsborganization/post").reply(200, org);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("org Code")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("org Code");
        const orgTranslationShortInput = screen.getByLabelText("org Translation Short");
        const orgTranslationInput = screen.getByLabelText("org Translation Long");
        const inactiveInput = screen.getByLabelText("inactive");

        const createButton = screen.getByText("Create");

        fireEvent.change(orgCodeInput, { target: { value: 'AS' } });
        fireEvent.change(orgTranslationShortInput, { target: { value: 'Associated Students' } });
        fireEvent.change(orgTranslationInput, { target: { value: 'Associated Students of UCSB' } });
        fireEvent.click(inactiveInput);
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(org);

        expect(mockToast).toBeCalledWith(`New organization Created - id: ${org.orgCode}, orgTranslation: ${org.orgTranslation}, orgTranslationShort: ${org.orgTranslationShort}, inactive: ${org.inactive} `);
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
    });

});