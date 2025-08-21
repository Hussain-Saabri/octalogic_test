import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
export default function Home() {
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const[isLoading,setIsLoading]=useState(false);
  const[bookingError,setBookingError]=useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wheels: "",
    vehicleType: "",
    vehicle_id:"",
    model: "",
    dates: { start: "", end: "" },
  });
 
  //validating the form
  const validateForm = (step,formData) => {
    console.log("Inside the validateform function");
    const newErrors = {};
   if(step === 1)
   {
if (!formData.firstName?.trim()) newErrors.firstName = "!Name is Required.";
    if (!formData.lastName?.trim()) newErrors.lastName = "!lastName is required.";
   }
   
   
   if (step === 2) {
    if (!formData.wheels) newErrors.wheels = "Please select 2 or 4 wheels.";
  }
  if (step === 3) {
    if (!formData.vehicleType) newErrors.vehicleType = "!Please Select the vehicle .";
  }
  if (step === 4) {
    if (!formData.model) newErrors.model = "!Model Name is Required.";
  }
  if (step === 5) {
    if (!formData.dates.start) newErrors.start = "!Start Date is Required.";
    if (!formData.dates.end) newErrors.end = "!End Date  is Required.";
  }


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
//getiing the model or vehiclee name
useEffect(() => {
  
  const fetchModels = async () => {
    console.log("getting the model name");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/vehicle-models?name=${formData.vehicleType}`
      );
      console.log("Models fetched:",response);
      setVehicleModels(response.data.vehicleModel);
     
    } catch (err) {
      console.error("Error fetching vehicle models", err);
      setVehicleModels([]);
    }
  };

  fetchModels();
}, [ formData.vehicleType]);

  // Handle Next / Submit
const handleNext = async () => {
  setBookingError("");
let response;
const errorsFound = validateForm(step, formData);
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
  setIsLoading(true);
  console.log("callinng the booking api");
   response = await axios.post(
    "http://localhost:8000/api/booking",{
  firstName: formData.firstName,
  lastName: formData.lastName,
  vehicle_id: formData.vehicle_id,
  start_date: formData.dates.start,
  end_date: formData.dates.end,
}); 
 
console.log("Booking api respose",response);
//  showing the toast-sucessfull


 } catch (err) {
  
  console.error(err);
  alert("Error submitting form.");
}finally {
  setTimeout(() => {
    setIsLoading(false);

    // ✅ show toast only after loader ends
    if (response?.data?.message === "Booking Suceesfull") {
      setBookingSuccess(response.data);
      toast.success("Bike Booked Successfully!", {
        style: {
          background: "linear-gradient(145deg, #34d399, #059669)",
          color: "#e6fffa",
          fontWeight: "700",
          borderRadius: "16px",
          padding: "10px 24px",
          boxShadow: "0 6px 20px rgba(5, 150, 105, 0.5), 0 0 10px rgba(56, 189, 248, 0.3)",
          fontSize: "18px",
          letterSpacing: "0.7px",
          textTransform: "capitalize",
          fontFamily: "'Poppins', sans-serif",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#a7f3d0",
          secondary: "#064e3b",
        },
        duration: 4000,
      });
    }
    
    if (response?.data?.message === "alreadyBooked!") {
      setBookingError("Please Select different dates");
      toast.error("Already Booked!", {
        style: {
          background: "linear-gradient(145deg, #ef4444, #b91c1c)",
          color: "#fff5f5",
          fontWeight: "700",
          borderRadius: "16px",
          padding: "10px 24px",
          boxShadow: "0 6px 20px rgba(239, 68, 68, 0.5), 0 0 10px rgba(248, 113, 113, 0.3)",
          fontSize: "18px",
          letterSpacing: "0.7px",
          textTransform: "capitalize",
          fontFamily: "'Poppins', sans-serif",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#fecaca",
          secondary: "#7f1d1d",
        },
        duration: 2000,
      });
    }

  }, 800); // same delay as loader
}

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {bookingSuccess ? (
  <div className="mt-6 p-6 bg-green-100 border border-green-400 rounded-xl text-center">
    <h2 className="text-2xl font-bold text-green-700">🎉 Booking Confirmed!</h2>
    <p className="mt-2 text-green-600">
      Your bike has been booked from <b>{formData.dates.start}</b> to <b>{formData.dates.end}</b>.
    </p>
    <button 
      onClick={() => {
        setStep(1);
        setBookingSuccess(null); 
      }} 
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      Book Another Ride
    </button>
  </div>
):(<div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-6">
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
                 {errors.wheels && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.wheels}</p>}
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
              {errors.vehicleType && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.vehicleType}</p>}
          </div>
        )}

          {step === 4 && (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-800">
      Choose Model
    </h2>

    {vehicleModels.length === 0 ? (
      <p className="text-gray-500">Loading models...</p>
    ) : (
      <div className="space-y-2">
        {vehicleModels.map((model) => (
          <label
            key={model.id}
            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              value={model.model_name}
              checked={formData.model === model.model_name}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value ,vehicle_id: model.type_id })
              }
              className="mr-2"
            />
            {model.model_name}
          </label>
        ))}
       {errors.model && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.model}</p>}
      </div>
    )}
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
                  {errors.start && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.start}</p>}
          
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
                  {errors.end && <p className="text-[16px] text-red-500 font-bold mt-1">{errors.end}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

       
       <div className="mt-6 flex justify-end">
  {step === 5 ? (
    <button
              type="submit"
              disabled={isLoading}
              onClick={handleNext}
              className={`w-full py-3 font-semibold rounded-xl shadow-md transition-all duration-200 ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={20} color="#ffffff" loading={true} />
                  <span className="ml-2">Submitting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>

  ) : (
    <button
      onClick={handleNext}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
    >
      Next
    </button>
  )}

</div>
  {bookingError && <p className="text-[16px] text-red-500 text-center block font-bold mt-1">{bookingError}</p>}
</div>)

}

      

      
    </div>
    
  );
}
