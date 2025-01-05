import Banner from "@/components/banner";
import { Fragment } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { getUserById } from "@/services/user";
import { redirect } from "next/navigation";
import Notification from "@/components/Notification";
import ServiceItem from "@/components/home/service-item";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Label } from "@/components/ui/label";
import PackageItem from "@/components/home/package-item";
import TrainerItem from "@/components/home/trainer-item";

async function Home() {
  const user = await currentUser();

  const response = await getUserById(user?.id);
  if (user && !response.success) {
    redirect("/onboard");
  } else {
    const userInfo = response.data;
    if (userInfo?.role === "manager" || userInfo?.role === "trainer")
      redirect("/admin");
  }

  return (
    <Fragment>
      <section>
        <div className="flex flex-col w-full mt-16 items-center">
          <Banner />
          <main className="w-full flex flex-col mt-8 row-start-2 items-center justify-center sm:items-start">
            {/* About StronGym */}
            <div className="flex w-full h-[400px] px-16">
              <div className="w-1/3 h-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/uploads/2022/04/home2-1.jpg')" }}
              ></div>
              <div className="w-2/3 h-full p-8 flex flex-col text-gray-800">
                <h2 className="text-2xl font-bold mb-2">Welcome to StronGym!</h2>
                <h3 className="text-xl font-semibold mb-4">
                  StronGym - Hành trình chinh phục vóc dáng lý tưởng
                </h3>
                <p className="text-sm leading-relaxed">
                Tại StronGym, chúng tôi cam kết đồng hành cùng bạn trên hành trình nâng cao sức khỏe và cải thiện vóc dáng. 
                Với trang thiết bị hiện đại, huấn luyện viên chuyên nghiệp và môi trường luyện tập đầy cảm hứng, 
                StronGym sẽ giúp bạn đạt được mục tiêu thể chất mơ ước.
                </p>
              </div>
            </div>

            {/* Dịch vụ */}
            <ServiceItem />

            {/* Gói tập */}
            <TrainerItem />

            {/* Footer */}
            <footer className="relative w-full h-[300px] bg-cover bg-center text-white"
              style={{ backgroundImage: "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/themes/gymat/assets/img/footer-1-bg.png')" }}
            >
              <div className="container mx-auto h-full flex items-center justify-between px-6">
                <div className="w-1/3 h-full bg-contain bg-no-repeat"
                  style={{ backgroundImage: "url('https://radiustheme.com/demo/wordpress/themes/gymat/wp-content/themes/gymat/assets/element/footer-2.png')" }}
                ></div>

                <div className="w-1/3 h-full flex flex-col justify-center items-center">
                  <h2 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h2>
                  <div className="flex space-x-6">
                    <a
                      href="https://www.facebook.com/duy.phungvan.3152130?mibextid=ZbWKwL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-2xl hover:text-blue-500 transition-colors"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      href="https://zalo.me/0911183701"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-2xl hover:text-blue-500 transition-colors"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/9425/9425215.png"
                        alt="Zalo Icon"
                        className="w-8 h-8"
                      />
                    </a>
                  </div>
                </div>

                <div className="w-1/3 h-full flex flex-col justify-center items-end text-right">
                  <h2 className="text-lg font-semibold mb-2">StronGym</h2>
                  <p className="text-sm">Địa chỉ: 123 Giải Phóng, Định Công, Hà Nội</p>
                  <p className="text-sm">SĐT CSKH: 0123 456 789</p>
                </div>
              </div>
            </footer>

          </main>
        </div>
        <Notification />
      </section>
    </Fragment>
  );
}

export default Home;
