import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function Home() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    model: "",
    dates: { start: "", end: "" },
  });
  //validating the form
  const validateForm = () => {
    console.log("Inside the validateform function");
    const newErrors = {};
   
   if (!formData.firstName?.trim()) newErrors.firstName = "!Name is Required.";
    if (!formData.lastName?.trim()) newErrors.lastName = "!lastName is required.";


    return newErrors;
  };
  //hooks being used to fetched the types of vechicles based on the wheels that use entered in the previous step
useEffect(() => {
  if (!formData.wheels) return;

  const fetchVehicleTypes = async () => {
    try {
      console.log("calling the api")
      const response = await axios.get(
        `http://localhost:8000/api/vehicle-types?wheels=${formData.wheels}`
      );
      console.log("Respose from the api",response.data.vehicleTypes);
      setVehicleTypes(response.data.vehicleTypes); 
    } catch (err) {
      console.error("Error fetching vehicle types", err);
      setVehicleTypes([]);
    }
  };

  fetchVehicleTypes();
}, [formData.wheels]);

  // Handle Next / Submit
const handleNext = async () => {

const errorsFound = validateForm();
      if (Object.values(errorsFound).length > 0) {
        console.log("Found erros");
      setErrors(errorsFound);
      return;
    } else {
      setErrors({});
    }

    if (step < 5) {
      setStep(step + 1);
      
      
    } else {
      try {
        const response = await fetch("", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Booking successful!");
          setFormData({
            firstName: "",
            lastName: "",
            wheels: "",
            vehicleType: "",
            model: "",
            dates: { start: "", end: "" },
          });
          setStep(1);
        } else {
          alert("Booking failed, please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Error submitting form.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form steps */}
        <div className="space-y-4">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                What is your name?
              </h2>
              <input
                type="text"
                placeholder="First Name"
                className="border w-full p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              {errors.firstName && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.firstName}</p>}
              <input
                type="text"
                placeholder="Last Name"
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              {errors.lastName && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.lastName}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Number of wheels
              </h2>
              <div className="space-y-2">
                {["2", "4"].map((w) => (
                  <label
                    key={w}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={w}
                      checked={formData.wheels === w}
                      onChange={(e) =>
                        setFormData({ ...formData, wheels: e.target.value })
                      }
                      className="mr-2"
                    />
                    {w}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Type of Vehicle
            </h2>

            {vehicleTypes.length === 0 ? (
              <p className="text-gray-500">Loading vehicle types...</p>
            ) : (
              <div className="space-y-2">
                {vehicleTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={type.name}
                      checked={formData.vehicleType === type.name}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleType: e.target.value })
                      }
                      className="mr-2"
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Choose Model
              </h2>
              <div className="space-y-2">
                {["Model A", "Model B"].map((m) => (
                  <label
                    key={m}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={m}
                      checked={formData.model === m}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      className="mr-2"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Select Booking Dates
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.dates.start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dates: { ...formData.dates, start: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.dates.end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dates: { ...formData.dates, end: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

       
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            {step === 5 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
