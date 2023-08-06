import { useAuthContext } from "@/context/auth-context";
import {
  createChallan,
  editChallan,
  getAllChallan,
  getDropDown,
  getDropDownFilter,
} from "../../pages/api/api";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import {
  CreateChallanData,
  Challans,
  CreateChallanReqDataObject,
  DropDown,
  CommonApiResponse,
  EditChallanData,
  DropDownFilter,
} from "../../pages/api/types";
import { CgSpinnerAlt } from "react-icons/cg";
import { commonToast } from "@/utils/helper";
import SuggestionList from "./SuggestionList";
import MultiSelectDropdown from "./MultiSelectDropDown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import exportToCSV from "@/utils/csvDowload";

const DispatchProduct = () => {
  //today date format
  const today = new Date();

  //authorization
  const { authUserData } = useAuthContext();

  //use states
  const [userChallansData, setUserChallansData] = useState<Challans[]>([]);

  const [isLoading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState("");

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<DropDown[]>([]);

  const [createChallanData, setCreateChallanData] = useState<CreateChallanData>(
    {
      userId: authUserData?.user?._id,
      challan_number: 0,
      date: "",
      from: "",
    }
  );

  const [filters, setFilters] = useState<any>({
    challanNumberFilter: 0,
    startDate: today,
    endDate: today,
    gradeFilter: "",
    fromFilter: [],
    typeFilter: [],
    colorFilter: [],
  });

  const [showDropdown, setShowDropdown] = useState<any>({
    from: false,
    color: false,
    type: false,
    index: 0,
    edit: false,
  });

  const [filterTotal, setFilterTotal] = useState<any>({
    totalWeight: 0,
    totalQuantity: 0,
  });

  const [rowData, setRowData] = useState<EditChallanData>({
    _id: "",
    userId: authUserData?.user?._id,
    challan_number: 0,
    date: today,
    from: "",
    size: "",
    type: "",
    color: "",
    quantity: 0,
    weight: 0,
    remarks: "",
  });

  const [createChallanDataArray, setCreateChallanDataArray] = useState<
    CreateChallanReqDataObject[]
  >([
    {
      size: "",
      type: "",
      color: "",
      quantity: 0,
      weight: 0,
      remarks: "",
    },
  ]);

  const [createDropDownFilter, setCreateDropDownFilter] =
    useState<DropDownFilter>({
      type: [],
      color: [],
      from: [],
    });
  //use states

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllChallan(authUserData.user._id, filters);
        console.log("data: ", data);
        const value = await getDropDownFilter(authUserData.user._id);
        setUserChallansData(data.challan);
        setFilterTotal(data.result);
        setCreateDropDownFilter({
          type: value.data.type,
          color: value.data.color,
          from: value.data.from,
        });
      } catch (error) {}
    })();
    setCreateChallanData({
      userId: authUserData?.user?._id,
      challan_number: 0,
      date: "",
      from: "",
    });
    setCreateChallanDataArray([
      {
        size: "",
        type: "",
        color: "",
        quantity: 0,
        weight: 0,
        remarks: "",
      },
    ]);
  }, [authUserData, filters]);

  const reset = () => {
    setFilters({
      challanNumberFilter: 0,
      startDate: today,
      endDate: today,
      gradeFilter: "",
      fromFilter: [],
      typeFilter: [],
      colorFilter: [],
    });
  };

  //handle input for challan creation
  const handleInput = (
    e:
      | ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | { target: { name: string; value: Date | null } }
  ) => {
    if ("target" in e) {
      setCreateChallanData({
        ...createChallanData,
        [e.target.name]: e.target.value,
      });
    }
  };

  //handle input array for challan creation
  const handleInputChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedData = [...createChallanDataArray];
    updatedData[index] = { ...updatedData[index], [name]: value };
    setCreateChallanDataArray(updatedData);
    const filters = {
      type: name,
      search: value,
    };
    const filteredSuggestions: CommonApiResponse<DropDown[]> =
      await getDropDown(authUserData.user._id, filters);
    setSuggestions(filteredSuggestions.data);
  };

  //handle dropdown
  const handleInputChangeDrop = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCreateChallanData({ ...createChallanData, from: value });
    setShowDropdown({ [e.target.name]: value !== "", ...showDropdown });
    const filters = {
      type: e.target.name,
      search: e.target.value,
    };
    const filteredSuggestions: CommonApiResponse<DropDown[]> =
      await getDropDown(authUserData.user._id, filters);
    setSuggestions(filteredSuggestions.data);
  };

  //handle add new suggestion to db
  const handleAddNewEntry = () => {
    const newEntry = createChallanData.from.trim();
    if (newEntry) {
      setCreateChallanData({ ...createChallanData, from: "" });
      setSelectedValue(newEntry);
      // Perform any logic to handle adding the new entry to your data source
      // For example, update a list of entries or make an API call
      // addNewEntry(newEntry);
    }
  };

  //handle suggestions list for edit and create
  const handleSelectSuggestion = (suggestion: string, index: number) => {
    if (showDropdown.from && showDropdown.edit == false) {
      setCreateChallanData({ ...createChallanData, from: suggestion });
    } else if (showDropdown.edit == false) {
      let name = "";
      if (showDropdown.color) {
        name = "color";
      } else if (showDropdown.type) {
        name = "type";
      }
      const updatedData = [...createChallanDataArray];
      updatedData[index] = { ...updatedData[index], [name]: suggestion };
      setCreateChallanDataArray(updatedData);
    } else {
      let name = "";
      if (showDropdown.color) {
        name = "color";
      } else if (showDropdown.type) {
        name = "type";
      } else if (showDropdown.from) {
        name = "from";
      }
      setRowData((prevData) => ({
        ...prevData,
        [name]: suggestion,
      }));
      console.log(rowData);
    }

    setSelectedValue(suggestion);
    setShowDropdown({
      from: false,
      color: false,
      type: false,
      edit: false,
      index: index,
    }); // Hide the dropdown after adding a new entry
  };

  //handle suggestions list for edit and create
  const handleSuggestionsOnFocus = async (type: string) => {
    console.log("type: ", type);
    const filters = {
      type: type,
      search: "",
    };
    const filteredSuggestions: CommonApiResponse<DropDown[]> =
      await getDropDown(authUserData.user._id, filters);
    setSuggestions(filteredSuggestions.data);
  };

  //save challan
  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let validate = validateFields(createChallanData);
      if (validate) validate = validateArray(createChallanDataArray);
      if (validate) {
        const { data } = await createChallan({
          ...createChallanData,
          data: createChallanDataArray,
        });
        setUserChallansData([...data, ...userChallansData]);
      } else {
        alert(
          "Some fields are missing. Please fill in all the required fields."
        );
      }
    } catch (error: any) {
      commonToast(error?.response?.data?.message);
      console.log(error);
    }
    setLoading(false);
  };

  //handle filtering for challan data
  const handleFilterChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | { target: { name: string; value: Date | null } }
  ) => {
    let adjustedDate = null;
    if (e.target.name === "startDate" || e.target.name === "endDate") {
      // Adjust the selected date to account for the timezone offset
      const timezoneOffset = new Date().getTimezoneOffset();
      adjustedDate = moment(e.target.value)
        .add(timezoneOffset, "minutes")
        .toDate();
      if ("target" in e) {
        setFilters({
          ...filters,
          [e.target.name]: adjustedDate,
        });
      }
      return;
    }
    if ("target" in e) {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    }
  };

  //multi select drop down for filtering challan data
  const handleSelectOption = (value: string, type: string) => {
    // Check if the value is already selected
    const isSelected = filters[type].includes(value);

    if (isSelected) {
      // Value is already selected, remove it from the selected values array
      setFilters({
        ...filters,
        [type]: filters[type].filter((val: string) => val !== value),
      });
    } else {
      // Value is not selected, add it to the selected values array
      setFilters({ ...filters, [type]: [...filters[type], value] });
    }
    if (!value && type) {
      setFilters({ ...filters, [type]: [] });
    }
  };

  //handle edit
  const handleEdit = (data: any) => {
    data.date = new Date(data.date);
    setRowData(data);
    setIsEditMode(data._id);
  };

  //handle input for challan edit
  const handleInputForEditChallan = async (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    setRowData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "type" || name === "from" || name === "color") {
      setShowDropdown({ [event.target.name]: value !== "", ...showDropdown });
      const filters = {
        type: event.target.name,
        search: event.target.value,
      };
      const filteredSuggestions: CommonApiResponse<DropDown[]> =
        await getDropDown(authUserData.user._id, filters);
      setSuggestions(filteredSuggestions.data);
    }
  };

  //save edit
  const handleSave = async () => {
    await editChallan(rowData);
    const { data } = await getAllChallan(authUserData.user._id, filters);
    setUserChallansData(data.challan);
    setFilterTotal(data.result);
    setIsEditMode("");
  };

  //cancel edit
  const handleCancel = () => {
    setIsEditMode("");
  };

  //util functions
  const addNewObject = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    setCreateChallanDataArray([
      ...createChallanDataArray,
      {
        size: "",
        type: "",
        color: "",
        quantity: 0,
        weight: 0,
        remarks: "",
      },
    ]);
  };

  const removeObject = (index: number) => {
    if (createChallanDataArray.length === 1) {
      // Prevent removing the only object in the array
      return;
    }
    const updatedData = [...createChallanDataArray];
    updatedData.splice(index, 1);
    setCreateChallanDataArray(updatedData);
  };

  function validateArray(createChallanDataArray: string | any[]) {
    for (let i = 0; i < createChallanDataArray.length; i++) {
      const obj = createChallanDataArray[i];
      if (
        // obj.size.trim() === "" ||
        obj.type.trim() === "" ||
        obj.color.trim() === "" ||
        obj.quantity < 1 ||
        obj.weight < 1
      ) {
        return false; // Validation failed
      }
    }
    return true; // Validation passed
  }

  function validateFields(createChallanData: {
    challan_number: number;
    date: string;
    from: string;
  }) {
    if (
      createChallanData.challan_number <= 0 ||
      createChallanData.date === "" ||
      createChallanData.from.trim() === ""
    ) {
      return false;
    }
    return true; // Empty string indicates no validation errors
  }

  const handleDownloadCSV = () => {
    const modifiedData = userChallansData.map((challan) => ({
      Date: new Date(challan.date).toLocaleDateString("en-GB"),
      "Challan No.": challan.challan_number,
      Through: challan.from,
      Grade: challan.size,
      Type: challan.type,
      Color: challan.color,
      Quantity: challan.quantity,
      "Quantity Type": "Box/Bags",
      "Weight in KGs": challan.weight,
      // Remarks: challan.remarks,
    }));
    exportToCSV(
      modifiedData,
      `Raw Material ${new Date(filters.startDate).toLocaleDateString(
        "en-GB"
      )} - ${new Date(filters.endDate).toLocaleDateString("en-GB")}` +
        filters.fromFilter.join(" ")
    );
  };
  //util functions

  //format values functions
  const formatWeight = (weight: number) => {
    const kilograms = Math.floor(weight);
    const grams = Math.round((weight - kilograms) * 1000);
    return `${kilograms} kg ${grams} g`;
  };
  //format values functions

  return (
    <div>
      <div className="flex flex-col justify-center mt-16 px-8 py-6 bchallan bchallan-neutral-800">
        {authUserData?.user?.name ? (
          <p className="text-20 text-neutral-300 mb-3">
            Hi, {authUserData.user.name}
          </p>
        ) : (
          <></>
        )}
        <div className="flex w-full justify-between">
          <p className="text-40 mb-3">Raw material received challan</p>
        </div>
        <form autoComplete="off" className="flex flex-wrap gap-x-8 mt-6 mb-4">
          <div className="flex flex-col relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              Challan Number
            </label>
            <input
              value={createChallanData.challan_number ?? 0}
              onChange={handleInput}
              name="challan_number"
              type="number" // Set the input type to "number"
              min={1} // Set the minimum value to 0
              autoFocus={false}
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
              placeholder={"Enter Challan Number"}
            />
          </div>
          <div className="flex flex-col relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              Date
            </label>
            <ReactDatePicker
              selected={createChallanData.date}
              onChange={(date: Date | null) =>
                handleInput({ target: { name: "date", value: date } })
              }
              required
              type="string" // Set the input type to "number"
              name="date"
              autoFocus={false}
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
      transition duration-200`}
              placeholderText="Select Date" // Placeholder text for the date picker
              dateFormat="dd/MM/yyyy" // Specify the desired date format
              locale="en" // Set the locale for date formatting
            />
          </div>
          <div className="relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              By
            </label>
            <input
              type="text"
              value={createChallanData.from}
              name="from"
              onFocus={() => {
                setShowDropdown({
                  from: true,
                  type: false,
                  color: false,
                  index: -1,
                  edit: false,
                });
                handleSuggestionsOnFocus("from");
              }}
              onChange={handleInputChangeDrop}
              placeholder="Type to search or add a new option"
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
    transition duration-200 mt-1`}
            />
            {showDropdown.from && !showDropdown.edit && (
              <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                <SuggestionList
                  suggestions={suggestions}
                  index={0}
                  setShowDropdown={setShowDropdown}
                  handleSelectSuggestion={handleSelectSuggestion}
                />
              </div>
            )}
          </div>
          <div>
            {createChallanDataArray.map(
              (obj: CreateChallanReqDataObject, index) => (
                <div key={index} className="flex gap-x-8 mt-5">
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Remarks
                      </label>
                    )}
                    <input
                      value={obj.remarks}
                      onChange={(e) => handleInputChange(index, e)}
                      name="remarks"
                      autoFocus={false}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Remarks"}
                    />
                  </div>
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Grade
                      </label>
                    )}
                    <input
                      value={obj.size ?? ""}
                      onChange={(e) => handleInputChange(index, e)}
                      name="size"
                      autoFocus={false}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Grade Quality"}
                    />
                  </div>
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Type
                      </label>
                    )}
                    <input
                      type="text"
                      value={obj.type}
                      name="type"
                      onFocus={() => {
                        setShowDropdown({
                          from: false,
                          type: true,
                          color: false,
                          index: index,
                          edit: false,
                        });
                        handleSuggestionsOnFocus("type");
                      }}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Type"}
                    />
                    {showDropdown.type &&
                      showDropdown.index == index &&
                      !showDropdown.edit && (
                        <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                          <SuggestionList
                            suggestions={suggestions}
                            index={index}
                            setShowDropdown={setShowDropdown}
                            handleSelectSuggestion={(
                              name: string,
                              index: number
                            ) => handleSelectSuggestion(name, index)}
                          />
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Color
                      </label>
                    )}
                    <input
                      type="text"
                      value={obj.color}
                      name="color"
                      onFocus={() => {
                        setShowDropdown({
                          from: false,
                          type: false,
                          color: true,
                          index: index,
                          edit: false,
                        });
                        handleSuggestionsOnFocus("color");
                      }}
                      onChange={(e) => handleInputChange(index, e)}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Color"}
                    />
                    {showDropdown.color &&
                      showDropdown.index == index &&
                      !showDropdown.edit && (
                        <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                          <SuggestionList
                            suggestions={suggestions}
                            index={index}
                            setShowDropdown={setShowDropdown}
                            handleSelectSuggestion={(
                              name: string,
                              index: number
                            ) => handleSelectSuggestion(name, index)}
                          />
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Quantity
                      </label>
                    )}
                    <input
                      value={obj.quantity ?? 0}
                      onChange={(e) => handleInputChange(index, e)}
                      name="quantity"
                      type="number" // Set the input type to "number"
                      min={1} // Set the minimum value to 0
                      required
                      autoFocus={false}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Quantity"}
                    />
                  </div>
                  <div className="flex flex-col relative">
                    {index === 0 && (
                      <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
                        Weight
                      </label>
                    )}
                    <input
                      value={obj.weight}
                      onChange={(e) => handleInputChange(index, e)}
                      name="weight"
                      min={1} // Set the minimum value to 0
                      type="number" // Set the input type to "number"
                      required
                      autoFocus={false}
                      className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"}  rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
            transition duration-200 `}
                      placeholder={"Enter Weight"}
                    />
                  </div>
                  <button
                    className={`bg-neutral-50 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 ${
                      index === 0 ? "mt-8" : ""
                    }`}
                    onClick={() => removeObject(index)}
                  >
                    -
                  </button>
                </div>
              )
            )}
            <div className="flex justify-end">
              <button
                className={`bg-neutral-50 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 mt-6`}
                onClick={addNewObject}
              >
                +
              </button>
            </div>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleFormSubmit}
            className={`${
              isLoading && "cursor-not-allowed opacity-70"
            } bg-neutral-50 text-neutral-950 rounded-[12px] py-3 px-5  w-full sm:w-auto inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 text-21`}
          >
            {isLoading ? (
              <CgSpinnerAlt
                className={
                  "text-neutral-950 transition-all animate-spin text-24 m-auto"
                }
              />
            ) : (
              "Save Challan"
            )}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className={`bg-green-50 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 mt-6 mr-6`}
            onClick={handleDownloadCSV}
          >
            Download CSV{" "}
          </button>
          <button
            className={`bg-red-400 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 mt-6 mr-14`}
            onClick={reset}
          >
            Reset{" "}
          </button>
        </div>
      </div>
      <div className="flex justify-between p-8 text-24">
        {/* <div className="w-[100px]">SN.</div> */}
        <div className="flex-1">Challan No.</div>
        <div className="flex-1">Date</div>
        <div className="flex-1">From</div>
        <div className="flex-1">Grade</div>
        <div className="flex-1">Type</div>
        <div className="flex-1">Color</div>
        <div className="flex-1">Quantity</div>
        <div className="flex-1">Weight</div>
        <div className="flex-1">Remarks</div>
        <div className="flex-1">Date Added</div>
        <div className="flex-1">Action</div>
      </div>
      <div className="flex justify-between p-8 text-24">
        {/* <div className="w-[100px]">-</div> */}
        <div className="flex-1">
          <input
            value={filters.challanNumberFilter}
            onChange={handleFilterChange}
            name="challanNumberFilter"
            type="number" // Set the input type to "number"
            min={1} // Set the minimum value to 0
            autoFocus={false}
            className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-14 placeholder:text-neutral-600
transition duration-200`}
            placeholder={"Enter Challan Number"}
          />
        </div>
        <div className="flex-1">
          <ReactDatePicker
            selected={filters.startDate}
            onChange={(date: Date | null) =>
              handleFilterChange({ target: { name: "startDate", value: date } })
            }
            name="startDate"
            autoFocus={false}
            className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-14 placeholder:text-neutral-600
      transition duration-200`}
            placeholderText="Select Date" // Placeholder text for the date picker
            dateFormat="dd/MM/yyyy" // Specify the desired date format
            locale="en" // Set the locale for date formatting
          />
          <ReactDatePicker
            selected={filters.endDate}
            onChange={(date: Date | null) =>
              handleFilterChange({ target: { name: "endDate", value: date } })
            }
            required
            name="endDate"
            autoFocus={false}
            className={`lightBgTextSelection w-32 bg-inherit mt-3 px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-14 placeholder:text-neutral-600
      transition duration-200`}
            placeholderText="Select Date" // Placeholder text for the date picker
            dateFormat="dd/MM/yyyy" // Specify the desired date format
            locale="en" // Set the locale for date formatting
          />
        </div>
        <div className="flex-1">
          <MultiSelectDropdown
            options={createDropDownFilter.from}
            type={"fromFilter"}
            selectedValues={filters.fromFilter}
            handleSelectOption={handleSelectOption}
          />
        </div>
        <div className="flex-1">
          <input
            value={filters.gradeFilter}
            onChange={handleFilterChange}
            name="gradeFilter"
            type="text" // Set the input type to "number"
            autoFocus={false}
            className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-14 placeholder:text-neutral-600
transition duration-200 ml-2`}
            placeholder={"Enter Grade"}
          />
        </div>
        <div className="flex-1">
          <MultiSelectDropdown
            options={createDropDownFilter.type}
            type={"typeFilter"}
            selectedValues={filters.typeFilter}
            handleSelectOption={handleSelectOption}
          />
        </div>
        <div className="flex-1">
          <MultiSelectDropdown
            options={createDropDownFilter.color}
            type={"colorFilter"}
            selectedValues={filters.colorFilter}
            handleSelectOption={handleSelectOption}
          />
        </div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
      </div>
      {userChallansData.map((el: Challans, idx: number) => {
        return (
          <div key={el._id} className="flex justify-between p-2 px-8 text-21">
            {/* <div className="w-[100px]">{idx + 1}</div> */}
            {isEditMode === el._id ? (
              <>
                <div className="flex-1">
                  <input
                    value={rowData.challan_number}
                    onChange={handleInputForEditChallan}
                    name="challan_number"
                    type="number" // Set the input type to "number"
                    min={1} // Set the minimum value to 0
                    autoFocus={false}
                    className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                  />
                </div>
                <div className="flex-1">
                  <ReactDatePicker
                    selected={rowData.date}
                    onChange={(date: Date | null) =>
                      handleInputForEditChallan({
                        target: { name: "date", value: date },
                      })
                    }
                    name="date"
                    autoFocus={false}
                    className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
      transition duration-200`}
                    placeholderText="Select Date" // Placeholder text for the date picker
                    dateFormat="dd/MM/yyyy" // Specify the desired date format
                    locale="en" // Set the locale for date formatting
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={rowData.from}
                    name="from"
                    onFocus={() => {
                      setShowDropdown({
                        from: true,
                        type: false,
                        color: false,
                        index: -1,
                        edit: true,
                      });
                      handleSuggestionsOnFocus("from");
                    }}
                    onChange={handleInputForEditChallan}
                    placeholder="Type to search or add a new option"
                    className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
                    transition duration-200`}
                  />
                  {showDropdown.from && showDropdown.edit && (
                    <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                      <SuggestionList
                        suggestions={suggestions}
                        index={0}
                        setShowDropdown={setShowDropdown}
                        handleSelectSuggestion={handleSelectSuggestion}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    value={rowData.size}
                    onChange={handleInputForEditChallan}
                    name="size"
                    type="text" // Set the input type to "number"
                    min={1} // Set the minimum value to 0
                    autoFocus={false}
                    className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
                    transition duration-200`}
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={rowData.type}
                    name="type"
                    onFocus={() => {
                      setShowDropdown({
                        from: false,
                        type: true,
                        color: false,
                        index: 0,
                        edit: true,
                      });
                      handleSuggestionsOnFocus("type");
                    }}
                    onChange={handleInputForEditChallan}
                    className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
                    transition duration-200`}
                    placeholder={"Enter Type"}
                  />
                  {showDropdown.type && showDropdown.edit && (
                    <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                      <SuggestionList
                        suggestions={suggestions}
                        index={0}
                        setShowDropdown={setShowDropdown}
                        handleSelectSuggestion={(name: string, index: number) =>
                          handleSelectSuggestion(name, 0)
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={rowData.color}
                    name="color"
                    onFocus={() => {
                      setShowDropdown({
                        from: false,
                        type: false,
                        color: true,
                        index: 0,
                        edit: true,
                      });
                      handleSuggestionsOnFocus("color");
                    }}
                    onChange={handleInputForEditChallan}
                    className={`lightBgTextSelection w-32 bg-inherit px-2 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
                    transition duration-200`}
                    placeholder={"Enter Color"}
                  />
                  {showDropdown.color && showDropdown.edit && (
                    <div className="absolute z-10 right-0 mt-2 max-h-40 overflow-y-auto">
                      <SuggestionList
                        suggestions={suggestions}
                        index={0}
                        setShowDropdown={setShowDropdown}
                        handleSelectSuggestion={(name: string, index: number) =>
                          handleSelectSuggestion(name, 0)
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    value={rowData.quantity}
                    onChange={handleInputForEditChallan}
                    name="quantity"
                    type="number" // Set the input type to "number"
                    min={1} // Set the minimum value to 0
                    autoFocus={false}
                    className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                  />
                </div>
                <div className="flex-1">
                  <input
                    value={rowData.weight}
                    onChange={handleInputForEditChallan}
                    name="weight"
                    type="number" // Set the input type to "number"
                    min={1} // Set the minimum value to 0
                    autoFocus={false}
                    className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                  />
                </div>
                <div className="flex-1">
                  <input
                    value={rowData.remarks}
                    onChange={handleInputForEditChallan}
                    name="remarks"
                    type="text" // Set the input type to "number"
                    min={1} // Set the minimum value to 0
                    autoFocus={false}
                    className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                  />
                </div>
                <div className="flex-1">
                  {new Date(el.createdAt).toLocaleDateString("en-GB")}
                </div>
              </>
            ) : (
              <>
                {userChallansData.length !== idx + 1 ? (
                  <div className="flex-1">{el.challan_number}</div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex-1">{el.challan_number}</div>
                      <div className="flex-1 mt-10 text-30">Total</div>
                    </div>
                  </>
                )}
                <div className="flex-1">
                  {new Date(el.date).toLocaleDateString("en-GB")}
                </div>
                <div className="flex-1">{el.from}</div>
                <div className="flex-1">{el.size}</div>
                <div className="flex-1">{el.type}</div>
                <div className="flex-1">{el.color}</div>
                {userChallansData.length !== idx + 1 ? (
                  <>
                    <div className="flex-1">{el.quantity} Box/Bags</div>
                    <div className="flex-1">{formatWeight(el.weight)}</div>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex-1">{el.quantity} Box/Bags</div>
                      <div className="flex-1 mt-10 text-21 ">
                        {filterTotal.totalQuantity} Box/Bags
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex-1">{formatWeight(el.weight)}</div>
                      <div className="flex-1 mt-10 text-21 ">
                        {formatWeight(filterTotal.totalWeight)}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex-1">{el.remarks}</div>
                <div className="flex-1">
                  {new Date(el.createdAt).toLocaleDateString("en-GB")}
                </div>
              </>
            )}
            <div className="flex-1">
              {isEditMode === el._id ? (
                <>
                  <div className="relative">
                    <button onClick={handleSave} className="text-30">
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button onClick={handleCancel} className="text-30 ml-4">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Render additional non-editable fields */}
                  <button onClick={() => handleEdit(el)} className="text-30">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DispatchProduct;
