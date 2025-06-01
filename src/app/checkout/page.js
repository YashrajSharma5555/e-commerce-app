"use client";

import React, { useState, useEffect } from "react";
import { parsePhoneNumberFromString, getCountries, getCountryCallingCode } from "libphonenumber-js";
import ApprovedComponent  from "../components/ApprovedComponent";
import DeclinedComponent from "../components/DeclinedComponent"
import GatewayFailureComponent from "../components/GatewayFailureComponent"
import { useRouter } from 'next/navigation';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function validatePhone(phone, country) {
  if (!country || !phone) return false;
  const phoneNumber = parsePhoneNumberFromString(phone, country);
  return phoneNumber ? phoneNumber.isValid() : false;
}

function validateCardNumber(number) {
  return /^\d{16}$/.test(number);
}

function validateExpiryDate(date) {
  if (!/^\d{2}\/\d{4}$/.test(date)) return false;

  const [monthStr, yearStr] = date.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) return false;

  const expiry = new Date(year, month, 1);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return expiry > now;
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "IT", name: "Italy" }, 
];


export default function LandingPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "IN", 
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [productInfo, setProductInfo] = useState({
    productName: "",
    variant: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductInfo({
      productName: params.get("title") || "",
      variant: params.get("variant") || "",
      quantity: parseInt(params.get("qty")) || 1,
      pricePerUnit: parseFloat(params.get("price")) || 0,
      productId:params.get("productId")
    });
  }, []);


  
  const router = useRouter();


  const subtotal = productInfo.pricePerUnit * productInfo.quantity;
  const total = subtotal;

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "cvv") {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "cardNumber") {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "phone") {

      if (!/^[\d +]*$/.test(value)) return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const [showOtpInput, setShowOtpInput] = useState(false);
const [otp, setOtp] = useState("");
const [otpResult, setOtpResult] = useState(null); 
const [orderId, setOrderId] = useState(null); 
const [orderNum, setOrderNum] = useState(null);
const [userEmail, setUserEmail] = useState(null);


async function handleOtpSubmit(e) {
  e.preventDefault();


  if (otp === "1") {

    // payload
    const payload = {
      userData: form,
      productData: productInfo,
    };


    // POST request
    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log("Sending payload:", payload);

      const result = await response.json();
      setOrderId(result.orderId); 


      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      console.log("Order submitted:", result);
      setOtpResult("approved");
      setOrderNum(result.orderNumber)
    } catch (err) {
      console.error(" API error:", err.message);
    }
  } else if (otp === "2") {
    setOtpResult("declined");
  } else if (otp === "3") {
    setOtpResult("gatewayFailure");
  } else {
    alert(" Invalid OTP entered.");
    return;
  }

  setOtp("");
}

useEffect(() => {
  if (otpResult === "approved" && orderId) {
    const timer = setTimeout(() => {
      router.push(`/thank-you?orderId=${orderId}`); 
    }, 1500);
    return () => clearTimeout(timer);
  }
}, [otpResult,orderId]);


useEffect(() => {
  setUserEmail(form.email)

  console.log(form.email)
}, [form.email]);






  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
  
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Invalid email format";
    if (!validatePhone(form.phone, form.country))
      newErrors.phone = "Invalid phone number for selected country";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim()) newErrors.zip = "Zip Code is required";
    if (!validateCardNumber(form.cardNumber))
      newErrors.cardNumber = "Card Number must be 16 digits";
    if (!validateExpiryDate(form.expiryDate))
      newErrors.expiryDate = "Expiry Date must be MM/YYYY and in the future";
    if (!validateCVV(form.cvv)) newErrors.cvv = "CVV must be 3 digits";
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      // OTP step
      setShowOtpInput(true);
    }
  }
  


  useEffect(() => {
    if (otpResult) {
      const timer = setTimeout(() => {
        setOtpResult(null);
        // setForm({
        //   fullName: "",
        //   email: "",
        //   country: "IN",
        //   phone: "",
        //   address: "",
        //   city: "",
        //   state: "",
        //   zip: "",
        //   cardNumber: "",
        //   expiryDate: "",
        //   cvv: "",
        // });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [otpResult]);


  return (
    <div className="max-w-3xl mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6">Checkout Form</h1>

      {/* Product Summary */}
      <div className="mb-6 border p-4 rounded text-black bg-gray-400">
        <h2 className="text-xl font-semibold mb-2">Product Summary</h2>
        <p>
          <strong>Product:</strong> {productInfo.productName}
        </p>
        <p>
          <strong>Variant:</strong> {productInfo.variant}
        </p>
        <p>
          <strong>Quantity:</strong> {productInfo.quantity}
        </p>
        <p>
          <strong>Price per Unit:</strong> ₹{productInfo.pricePerUnit}
        </p>
        <p className="mt-2 font-semibold">Total: ₹{total.toFixed(2)}</p>
      </div>
{/* Conditionally render form  */}
{!showOtpInput ? (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Select */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="country">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
          >
            {countries.map(({ code, name }) => (
              <option key={code} value={code}>
                {name} (+{getCountryCallingCode(code)})
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-600 text-sm">{errors.country}</p>
          )}
        </div>

        {/* Phone input */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder={`Include country code, e.g. +${getCountryCallingCode(
              form.country
            )}xxxxxxxxxx`}
            className={`w-full border p-2 rounded ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Rest of inputs */}
        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "address", label: "Address", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "zip", label: "Zip Code", type: "text" },
          {
            name: "cardNumber",
            label: "Card Number",
            type: "text",
            maxLength: 16,
            placeholder: "16 digits",
          },
          {
            name: "expiryDate",
            label: "Expiry Date (MM/YYYY)",
            type: "text",
            maxLength: 7,
            placeholder: "MM/YYYY",
          },
          {
            name: "cvv",
            label: "CVV",
            type: "password",
            maxLength: 3,
            placeholder: "3 digits",
          },
        ].map(({ name, label, type, ...rest }) => (
          <div key={name}>
            <label className="block font-semibold mb-1" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              {...rest}
              className={`w-full border p-2 rounded ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[name] && (
              <p className="text-red-600 text-sm">{errors[name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Order
        </button>
      </form>
          ) : (
            <div className="border p-4 rounded bg-gray-700 mb-6">
              <p className="mb-2 font-semibold">Your details are submitted.</p>
              <button
                onClick={() => setShowOtpInput(false)}
                className="text-blue-600 underline"
              >
                Edit Details
              </button>
            </div>
          )}
      
      {showOtpInput && (
        <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
          <label className="block font-semibold mb-1" htmlFor="otp">
            Enter OTP (1 = Approved, 2 = Declined, 3 = Gateway Failure)
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter 1, 2, or 3"
            className="w-full border p-2 rounded border-gray-300"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verify OTP and Submit form
          </button>
        </form>
      )}

      {/* Conditional Rendering for Result */}
      {otpResult === "approved" && (
        <div className="mt-6">
          <ApprovedComponent orderNum={orderNum} orderId={orderId} />
        </div>
      )}
      {otpResult === "declined" && (
        <div className="mt-6">
          <DeclinedComponent userEmail={userEmail}  />
        </div>
      )}
      {otpResult === "gatewayFailure" && (
        <div className="mt-6">
          <GatewayFailureComponent userEmail={userEmail}  />
        </div>
      )}


    </div>
  );
}
