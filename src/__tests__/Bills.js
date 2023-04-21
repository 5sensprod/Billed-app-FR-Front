/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import Bills from '../containers/Bills.js';

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //Verifier que la classe active-icon est bien présente
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy() // ajout de l'expression expect


    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dateElements = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
      // Utilisation de l'attribut "data-testid-unformatted-date au lieu de innnerhtml
      const dates = dateElements.map(a => new Date(a.getAttribute("data-testid-unformatted-date")))
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("When I click on the 'Nouvelle note de frais' button, I should be redirected to the 'Nouvelle note de frais' page", async () => {
      // Set up
      const onNavigate = jest.fn();
      document.body.innerHTML = BillsUI({ data: [] });
      const root = document.getElementById("root");
      const billPage = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const buttonNewBill = screen.getByTestId("btn-new-bill");

      // Action
      buttonNewBill.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      // Assert
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill);
    })
    test('getBills should return an array of bills sorted by date', async () => {
      // Set up
      const bills = [
        {
          id: '1',
          date: '2022-04-22',
          amount: 100,
          name: 'Bill 1',
          status: 'pending',
        },
        {
          id: '2',
          date: '2022-04-23',
          amount: 200,
          name: 'Bill 2',
          status: 'accepted',
        },
        {
          id: '3',
          date: '2022-04-21',
          amount: 300,
          name: 'Bill 3',
          status: 'refused',
        },
      ];
      const store = {
        bills: jest.fn(() => ({
          list: jest.fn(() => Promise.resolve(bills)),
        })),
      };
      const billsPage = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      // Action
      const result = await billsPage.getBills();

      // Assert
      expect(store.bills().list).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: '2',
          date: '2022-04-23',
          amount: 200,
          name: 'Bill 2',
          status: 'accepted',
          formattedDate: expect.any(String),
        },
        {
          id: '1',
          date: '2022-04-22',
          amount: 100,
          name: 'Bill 1',
          status: 'pending',
          formattedDate: expect.any(String),
        },
        {
          id: '3',
          date: '2022-04-21',
          amount: 300,
          name: 'Bill 3',
          status: 'refused',
          formattedDate: expect.any(String),
        },
      ]);
    })
    test("should open the modal and display the bill image", () => {
      // Set up
      document.body.innerHTML = `<div id="modaleFile">
                                     <div class="modal-body"></div>
                                   </div>`;
      const icon = document.createElement("i");
      icon.setAttribute("data-bill-url", "https://example.com/bill.png");
      const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
      const billsPage = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage,
      });

      // Action
      billsPage.handleClickIconEye(icon);

      // Assert
      const modalBody = document.querySelector(".modal-body");
      expect(modalBody.innerHTML).toContain(
        `<img width=${imgWidth} src="https://example.com/bill.png" alt="Bill" />`
      );
      expect($("#modaleFile").hasClass("show")).toBe(true);
    });
  })
})