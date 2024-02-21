import { toast } from "react-toastify";
import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/utils/UCSBOrganizationUtils";

// Mocking the react-toastify module
jest.mock("react-toastify", () => ({
  toast: jest.fn()
}));

describe("UCSBOrganizationUtils", () => {

  describe("onDeleteSuccess", () => {
    it("calls toast with the provided message", () => {
      const message = "Organization deleted successfully";
      onDeleteSuccess(message);
      expect(toast).toHaveBeenCalledWith(message);
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    it("returns correct axios params for delete request", () => {
      const cell = {
        row: {
          values: {
            orgCode: "LI"
          }
        }
      };
      const expectedParams = {
        url: "/api/ucsborganization",
        method: "DELETE",
        params: {
          orgCode: "LI"
        }
      };
      const result = cellToAxiosParamsDelete(cell);
      expect(result).toEqual(expectedParams);
    });
  });

});
