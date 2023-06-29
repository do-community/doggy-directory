import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'; import userEvent from '@testing-library/user-event';
import mockFetch from "./mocks/mockFetch";
import App from "./App";

beforeEach(() => {
  //mock function that tracks calls to fetch attached to global window variable in DOM
  //mockFetch overrides original fetch implementation, runs when fetch is called
  jest.spyOn(window, "fetch").mockImplementation(mockFetch);
})

afterEach(() => {
  jest.restoreAllMocks()
});

test("renders the landing page", async () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");
  //findBy verifies doc contains option with value husky
  //use findBy queries when testing asyn code depending on something being in the DOM after some time
  //findBy query returns a promise that is resolved when the element is foundi n the DOM, so we need await keyword

  expect(await screen.findByRole("option", { name: "husky" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  expect(screen.getByRole("img")).toBeInTheDocument();
});

//test to verify search, load, and image display work properly
test("should be able to search and display dog image results", async () => {
  render(<App />);

  //Simulate selecting an dog breed and verifying its value
  const select = screen.getByRole("combobox");
  //wait for cattledog to appear before continuing assertions
  expect(await screen.findByRole("option", { name: "cattledog" })).toBeInTheDocument();
  userEvent.selectOptions(select, "cattledog");
  expect(select).toHaveValue("cattledog");

  //Simulate initiating the search request
  const searchBtn = screen.getByRole("button", { name: "Search" });
  expect(searchBtn).not.toBeDisabled(); //search button not disabled when select breed
  userEvent.click(searchBtn);

  //Loading state displays and gets removed once results are displayed
  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

  //Verify image display and results count
  //AllBy returns array with multiple elements matching the role (all dog images)
  const dogImages = screen.getAllByRole("img"); 
  expect(dogImages).toHaveLength(2);
  expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
  expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
  expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
})

//each test block takes 2 parameters: name of test case, function 
