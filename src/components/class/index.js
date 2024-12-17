"use client";

import { getClassById, getClasses } from "@/services/class";
import { showToast } from "@/utils";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDebounce } from "use-debounce";
import { HashLoader } from "react-spinners";
import ClassCard from "../card/class-card";
import Notification from "../Notification";
import ClassDialog from "../dialog/class-dialog";
import { loadStripe } from "@stripe/stripe-js";
import {
  createMemberClass,
  getClassesByMemberId,
} from "@/services/memberClass";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { createPayment } from "@/services/payment";

const stripePromise = loadStripe(
  "pk_test_51QFAkUK75TYYGOvNTKpUDWmECZve6RrLFFKddJFlA1tfJqUmcWvmimz2RaP0jPKs6XF1rdzKeeZ3GHJjxRkBGOSo00gWa399z0"
);

export default function Class({ userInfo }) {
  const pathname = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isAllowRegister, setIsAllowRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
    try {
      setIsLoading(true);

      // Fetch user's classes
      const userClassesResponse = await getClassesByMemberId(userInfo.memberId);
      if (!userClassesResponse.success) throw new Error("Failed to fetch user classes.")
      // if (userClassesResponse.success) {
        const userClasses = userClassesResponse.data;
        // If user is enrolled in any classes, fetch details for those classes
        const enrolledClasses = userClasses.length ? await Promise.all(userClasses.map((item) => getClassById(item.classId))) : []
        setMyClasses(enrolledClasses)

        // Fetch all classes
        const allClassesResponse = await getClasses()
        if (!allClassesResponse.success) throw new Error("Failed to fetch all classes.");
        const allClasses = allClassesResponse.data;

        // Filter remaining classes that the user is not enrolled in
        const remainingClasses = allClasses.filter((classItem) => 
          !enrolledClasses.some((myClass) => myClass._id === classItem._id)
          && classItem.status !== "EXPIRED")
        setClasses(remainingClasses);

        // if (userClasses.length) { // nếu người dùng có tham gia lớp học nào đó
        //   const classDetailsPromises = data.map((item) =>
        //     getClassById(item.classId)
        //   );
        //   const classDetails = await Promise.all(classDetailsPromises);
        //   setMyClasses(classDetails);

        //   try {
        //     const res = await getClasses();
        //     if (res.success) {
        //       const allClasses = res.data;
        //       const remainingClasses = allClasses.filter(
        //         (classItem) =>
        //           !classDetails.some((myClass) => myClass._id === classItem._id)
        //       );
        //       setClasses(remainingClasses);
        //     }
        //   } catch (err) {
        //     showToast("error", "Có lỗi xảy ra khi lấy thông tin lớp học.");
        //   }
        // } else {
        //   try {
        //     const res = await getClasses();
        //     if (res.success) {
        //       const allClasses = res.data;
        //       setClasses(allClasses);
        //     }
        //   } catch (err) {
        //     showToast("error", "Có lỗi xảy ra khi lấy thông tin lớp học.");
        //   }
        // }
      // }
    } catch (err) {
      showToast("error", err.message || "Có lỗi xảy ra khi lấy thông tin lớp học của bạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(debouncedFilterValue.toLowerCase())
  );

  // hàm thanh toán lớp học qua Stripe
  const handlePayment = async (selectedClass) => {
    const stripe = await stripePromise;
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedClass.name,
          price: selectedClass.price,
          currency: selectedClass.currency.toLowerCase(),
          url: "class",
        }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("currentClass", JSON.stringify(selectedClass));
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      }
    } catch (err) {
      console.error("Payment error: ", err);
    }
  };

  // hàm tạo bản ghi Payment sau khi đăng ký lớp thành công
  async function handleCreatePayment(currentClass) {
    try {
      const paymentData = {
        customer: userInfo.username,
        memberId: userInfo.memberId,
        membershipPlanId: null,
        classId: currentClass._id,
        amount: currentClass.price,
        currency: currentClass.currency,
        description: `Thanh toán cho ${currentClass.name}`,
        paymentMethod: "stripe",
      };
      const response = await createPayment(paymentData);
      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // hàm tạo quan hệ member-class sau khi đăng ký lớp thành công
  async function handleCreateMemberClass(currentClass) {
    try {
      const body = {
        memberId: userInfo.memberId,
        classId: currentClass._id,
      };
      const response = await createMemberClass(body);
      if (response.success) {
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (pathname.get("status") === "success") {
      const currentClass = JSON.parse(sessionStorage.getItem("currentClass"));
      if (!currentClass || !currentClass._id) return;
      // Lấy danh sách các classId đã được xử lý từ sessionStorage
      const processedClasses =
        JSON.parse(sessionStorage.getItem("processedClasses")) || [];

      // Kiểm tra nếu classId hiện tại đã được xử lý chưa
      if (!processedClasses.includes(currentClass._id)) {
        const handleData = async () => {
          await Promise.all([
            handleCreatePayment(currentClass),
            handleCreateMemberClass(currentClass),
          ]);
        };
        handleData();

        // Cập nhật lại danh sách processedClasses trong sessionStorage
        processedClasses.push(currentClass._id);
        sessionStorage.setItem(
          "processedClasses",
          JSON.stringify(processedClasses)
        );
      }
    }
  }, [pathname]);

  const cardClick = (classItem) => {
    setSelectedClass(classItem);
    setIsOpenDialog(true);
    if(myClasses.length) {
      const isRegistered = myClasses.some(
        (registeredClass) => registeredClass._id === classItem._id
      );
      if (isRegistered) {
        setIsAllowRegister(false);
      }
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto py-8 px-4 mt-16">
        {myClasses && myClasses.length ? (
          <div>
            <Label className="text-lg font-bold text-gray-700">
              Lớp học của bạn: {myClasses.length} lớp
            </Label>
            <div className="grid mt-6 mb-10 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myClasses.map((classItem) => (
                <ClassCard
                  key={classItem?._id}
                  classItem={classItem}
                  onClick={cardClick}
                />
              ))}
            </div>
            <hr className="mb-10 border-b border-gray-400 w-full" />
          </div>
        ) : null}

        <div className="mb-6 flex items-center justify-between">
          <Input
            type="text"
            placeholder="Tìm lớp học theo tên"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center">
            <Label className="italic mr-3 font-bold text-gray-600">
              Tổng: {filteredClasses.length} lớp học
            </Label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <HashLoader loading={isLoading} color="#1e293b" size={50} />
          </div>
        ) : filteredClasses.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">Không có lớp học</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classItem) => (
              <ClassCard
                key={classItem._id}
                classItem={classItem}
                onClick={cardClick}
              />
            ))}
          </div>
        )}

        <ClassDialog
          isOpen={isOpenDialog}
          onClose={() => {
            setIsOpenDialog(false);
            setSelectedClass(null);
            setIsAllowRegister(true);
          }}
          register={handlePayment}
          class={selectedClass}
          allowRegister={isAllowRegister}
          key={selectedClass ? selectedClass._id : "new"}
        />

        <Notification />
      </div>
    </Elements>
  );
}
