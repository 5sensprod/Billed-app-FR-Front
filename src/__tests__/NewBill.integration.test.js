import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Integration test - NewBill", () => {
  let newBillInstance;

  beforeEach(() => {
    const html = NewBillUI();
    document.body.innerHTML = html;
    const onNavigate = jest.fn();
    const storeMock = {
      bills: jest.fn().mockReturnValue({
        create: jest.fn(),
        update: jest.fn(),
      }),
    };
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "test@employee.com" })
    );
    newBillInstance = new NewBill({
      document,
      onNavigate,
      store: storeMock,
      localStorage: window.localStorage,
    });
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  test("should submit the form and call updateBill method", () => {
    // Fill the required fields
    const expenseTypeSelect = screen.getByTestId("expense-type");
    const expenseNameInput = screen.getByTestId("expense-name");
    const amountInput = screen.getByTestId("amount");
    const datepickerInput = screen.getByTestId("datepicker");

    fireEvent.change(expenseTypeSelect, { target: { value: "Restaurant" } });
    fireEvent.change(expenseNameInput, { target: { value: "Test expense" } });
    fireEvent.change(amountInput, { target: { value: "100" } });
    fireEvent.change(datepickerInput, { target: { value: "2023-05-05" } });

    // Mock the updateBill method
    newBillInstance.updateBill = jest.fn();

    // Submit the form
    const formNewBill = screen.getByTestId("form-new-bill");
    fireEvent.submit(formNewBill);

    // Verify that updateBill method is called
    expect(newBillInstance.updateBill).toHaveBeenCalled();
  });

});