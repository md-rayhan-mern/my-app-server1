export const globalError = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // ১. অরিজিনাল err থেকে সরাসরি মানগুলো নিয়ে একটি প্লেইন অবজেক্ট তৈরি করছি
  let error = {
    statusCode: err.statusCode || 500,
    status: err.status || "error",
    message: err.message || "Internal Server Error",
    name: err.name || "Error",
    code: err.code || "INTERNAL_SERVER_ERROR",
    stack: err.stack,
    isOperational: err.isOperational || false,
  };

  // ১. MongoDB Duplicate Key Error (যেমন: একই আইডি বা নাম বারবার দিলে)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {});
    const value = err.keyValue ? err.keyValue[field] : "unknown";
    error.message = `${field} (মান: ${value}) অলরেডি ডাটাবেজে আছে! এটি ইউনিক হতে হবে।`;
    error.statusCode = 400;
    error.status = "fail";
    error.isOperational = true; // এটি true দিলে প্রডাকশনেও আসল মেসেজ দেখাবে
  }

  // ২. Mongoose ValidationError (স্কিমার required বা min/max নিয়ম ভাঙলে)
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error.statusCode = 400;
    error.status = "fail";
    error.isOperational = true;
  }

  // ৩. MongoDB CastError (ভুল ডাটা টাইপ পাঠালে, যেমন: Number ফিল্ডে String দিলে)
  if (err.name === "CastError") {
    error.message = `ভুল ডাটা ফরম্যাট! ${err.path} ফিল্ডে '${err.value}' ডাটাটি সঠিক নয় ।`;
    error.statusCode = 400;
    error.status = "fail";
    error.isOperational = true;
  }

  if (process.env.NODE_ENV === "development") {
    // 💡 এখানে 'return' যোগ করা হয়েছে এবং অরিজিনাল err এর জায়গায় মডিফাইড error বসানো হয়েছে
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      //error: error,
      stack: error.stack,
    });
  } else {
    console.error("ERROR " + err);
    // 💡 এখানে 'return' যোগ করা হয়েছে যেন কোড ডাবল রেসপন্স না পাঠায়
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.isOperational ? error.message : "Something went wrong",
    });
  }
};
