import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            orgCode: "LI"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode : "LI" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Organization");
            expect(screen.queryByTestId("UCSBOrganization-orgCode")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode : "LI" } }).reply(200, {
                orgCode: "LI",
                orgTranslationShort: "Los Ingenieros",
                orgTranslation: "Los Ingenieros SHPE UCSB",
                inactive: "false"
            });
            axiosMock.onPut('/api/ucsborganization').reply(200, {
                orgCode: "AS",
                orgTranslationShort: "Associated Students",
                orgTranslation: "Associated Students of UCSB",
                inactive: "true"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("LI");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Los Ingenieros");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Los Ingenieros SHPE UCSB");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toBeChecked("false");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(orgCodeField, { target: { value: 'AS' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'Associated Students' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Associated Students of UCSB' } });
            fireEvent.change(inactiveField, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - id: AS orgTranslation: Associated Students of UCSB orgTranslationShort: Associated Students inactive: true");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode : "AS" });

            fireEvent.change(inactiveField, { target: { checked: true } });

fireEvent.click(submitButton);

await waitFor(() => expect(mockToast).toBeCalled());
expect(mockToast).toBeCalledWith("Organization Updated - id: AS orgTranslation: Associated Students of UCSB orgTranslationShort: Associated Students inactive: true");
expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

// Correctly assert the sent data, using .toEqual for deep comparison
expect(axiosMock.history.put.length).toBe(1); // times called
// Ensure you're parsing the JSON from the Axios mock to compare as objects
expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({

    orgTranslationShort: "Associated Students",
    orgTranslation: "Associated Students of UCSB",
    inactive: "false" 
});


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("LI");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("Los Ingenieros");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("Los Ingenieros SHPE UCSB");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toBeChecked("false");

            fireEvent.change(orgCodeField, { target: { value: 'AS' } });
            fireEvent.change(orgTranslationShortField, { target: { value: 'Associated Students' } });
            fireEvent.change(orgTranslationField, { target: { value: 'Associated Students of UCSB' } });
            fireEvent.change(inactiveField, { target: { value: 'true' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Organization Updated - id: AS orgTranslation: Associated Students of UCSB orgTranslationShort: Associated Students inactive: true");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
        });


       
    });
});