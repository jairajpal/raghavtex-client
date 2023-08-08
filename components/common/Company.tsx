import { useAuthContext } from "@/context/auth-context";
import { createCompany, editCompany, getAllCompany } from "../../pages/api/api";
import "react-datepicker/dist/react-datepicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { commonToast } from "@/utils/helper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import exportToCSV from "@/utils/csvDowload";
import { Company } from "@/pages/api/types";

interface Props {}

const Company: React.FC<Props> = () => {
  //today date format
  const today = new Date();

  //authorization
  const { authUserData } = useAuthContext();

  //use states
  const [userCompanysData, setUserCompanysData] = useState<any>([]);

  const [isLoading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState("");

  const [createCompanyData, setCreateCompanyData] = useState<any>({
    userId: authUserData?.user?._id,
    name: "",
    gst: "",
    phone: "",
  });

  const [rowData, setRowData] = useState<any>({
    _id: "",
    userId: authUserData?.user?._id,
    name: "",
    gst: "",
    phone: "",
  });

  //use states

  //use effects
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllCompany(authUserData.user._id);
        setUserCompanysData(data);
      } catch (error) {}
    })();
    setCreateCompanyData({
      userId: authUserData?.user?._id,
      name: "",
      gst: "",
      phone: "",
    });
  }, [authUserData]);

  const reset = () => {};

  //handle input for company creation
  const handleInput = (
    e:
      | ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | { target: { name: string; value: Date | null } }
  ) => {
    if ("target" in e) {
      setCreateCompanyData({
        ...createCompanyData,
        [e.target.name]: e.target.value,
      });
    }
  };

  //save company
  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createCompany({
        ...createCompanyData,
      });
      setUserCompanysData([...userCompanysData, data]);
    } catch (error: any) {
      commonToast(error?.response?.data?.message);
      console.log(error);
    }
    setLoading(false);
  };

  //handle edit
  const handleEdit = (data: any) => {
    console.log("data: ", data);
    setRowData(data);
    setIsEditMode(data._id);
  };

  //handle input for company edit
  const handleInputForEditCompany = async (event: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = event.target;
    setRowData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //save edit
  const handleSave = async () => {
    await editCompany(rowData);
    const { data } = await getAllCompany(authUserData.user._id);
    setUserCompanysData(data);
    setIsEditMode("");
  };

  //cancel edit
  const handleCancel = () => {
    setIsEditMode("");
  };

  //util functions

  const handleDownloadCSV = () => {
    const modifiedData = userCompanysData.map((company: any) => ({
      Date: new Date(company.date).toLocaleDateString("en-GB"),
      "Company No.": company.company_number,
      Through: company.from,
      Size: company.size,
      Type: company.type,
      Color: company.color,
      Quantity: company.quantity,
      "Quantity Type": "Box/Bags",
      "Weight in KGs": company.weight,
      // Remarks: company.remarks,
    }));
    exportToCSV(modifiedData, `Company pdf`);
  };
  //util functions

  //format values functions

  return (
    <div>
      <div className="flex flex-col justify-center mt-16 px-8 py-6 bcompany bcompany-neutral-800">
        {authUserData?.user?.name ? (
          <p className="text-20 text-neutral-300 mb-3">
            Hi, {authUserData.user.name}
          </p>
        ) : (
          <></>
        )}
        <div className="flex w-full justify-between">
          <p className="text-40 mb-3">Companies listing</p>
        </div>
        <form autoComplete="off" className="flex flex-wrap gap-x-8 mt-6 mb-4">
          <div className="flex flex-col relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              Company Name
            </label>
            <input
              value={createCompanyData.name ?? 0}
              onChange={handleInput}
              name="name"
              type="string" // Set the input type to "number"
              autoFocus={false}
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
              placeholder={"Enter company name"}
            />
          </div>
          <div className="flex flex-col relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              GST Number
            </label>
            <input
              value={createCompanyData.gst}
              onChange={handleInput}
              name="gst"
              type="sring" // Set the input type to "number"
              autoFocus={false}
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
              placeholder={"Enter gst number"}
            />
          </div>
          <div className="flex flex-col relative">
            <label className="text-neutral-400 inter-400 text-20 mb-[6px]">
              Phone Number
            </label>
            <input
              value={createCompanyData.phone}
              onChange={handleInput}
              name="phone"
              type="string" // Set the input type to "number"
              autoFocus={false}
              className={`lightBgTextSelection w-full bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
              placeholder={"Enter phone number"}
            />
          </div>
        </form>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleFormSubmit}
            className={`${
              isLoading && "cursor-not-allowed opacity-70"
            } bg-neutral-50 text-neutral-950 rounded-[12px] py-3 px-5  w-full sm:w-auto inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 text-21 mt-10`}
          >
            {isLoading ? (
              <CgSpinnerAlt
                className={
                  "text-neutral-950 transition-all animate-spin text-24 m-auto"
                }
              />
            ) : (
              "Save Company"
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
          {/* <button
            className={`bg-red-400 text-neutral-950 rounded-[12px] py-3 px-5 inter-600 disabled:opacity-60 disabled:text-neutral-950 disabled:cursor-not-allowed h-[48px] hover:opacity-80 transition duration-300 mt-6 mr-14`}
            onClick={reset}
          >
            Reset{" "}
          </button> */}
        </div>
      </div>
      <div className="flex justify-center p-8 text-24">
        <div className="flex-1">Company Name</div>
        <div className="flex-1">Gst Number</div>
        <div className="flex-1">Phone Number</div>
        <div className="flex-1">Date added</div>
        <div className="flex-1">Action</div>
      </div>
      {/* <div className="flex justify-between p-8 text-24">
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
        <div className="flex-1">-</div>
      </div> */}
      {userCompanysData?.length &&
        userCompanysData.map((el: Company, idx: number) => {
          return (
            <div key={el._id} className="flex justify-between p-2 px-8 text-21">
              {/* <div className="w-[100px]">{idx + 1}</div> */}
              {isEditMode === el._id ? (
                <>
                  <div className="flex-1">
                    <input
                      value={rowData.name}
                      onChange={handleInputForEditCompany}
                      name="name"
                      type="string" // Set the input type to "number"
                      autoFocus={false}
                      className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={rowData.gst}
                      onChange={handleInputForEditCompany}
                      name="gst"
                      type="string" // Set the input type to "number"
                      autoFocus={false}
                      className={`lightBgTextSelection w-28 bg-inherit px-4 py-3 ${"outline-[1px] outline-neutral-750 hover:outline-[1px] hover:outline-neutral-50 focus:outline-[1.5px] focus:outline-neutral-50"} rounded-[12px] outline-none text-neutral-50 text-16 placeholder:text-neutral-600
transition duration-200`}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={rowData.phone}
                      onChange={handleInputForEditCompany}
                      name="phone"
                      type="string" // Set the input type to "number"
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
                  <div className="flex-1">{el.name}</div>
                  <div className="flex-1">{el.gst}</div>
                  <div className="flex-1">{el.phone}</div>
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

export default Company;
