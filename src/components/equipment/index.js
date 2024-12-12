"use client";

import {
  createEquipment,
  deleteEquipment,
  getEquipments,
  updateEquipment,
} from "@/services/equipment";
import { showToast } from "@/utils";
import Notification from "../Notification";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { HashLoader } from "react-spinners";
import EquipmentTable from "../table/equipment-table";

export default function Equipment({ userInfo }) {
  const [eqms, setEqms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEqms();
  }, []);

  const fetchEqms = async () => {
    try {
      setIsLoading(true);
      const response = await getEquipments();
      if (response.success) {
        setEqms(response.data);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi xảy ra khi lấy thông tin thiết bị.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEqm = async (updatedEqm) => {
    try {
      let response;
      if (updatedEqm._id) {
        response = await updateEquipment(updatedEqm._id, updatedEqm);
        if (response.success) {
          setEqms((prevEqms) =>
            prevEqms.map((e) => (e._id === updatedEqm._id ? response.data : e))
          );
          showToast("success", response.message);
        } else showToast("error", response.message);
      } else {
        response = await createEquipment({ ...updatedEqm, creatorId: userInfo._id });
        if (response.success) {
          setEqms((prevEqms) => [...prevEqms, response.data]);
          showToast("success", response.message);
        } else showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi lưu thông tin thiết bị.");
    }
  };

  const handleDeleteEqm = async (id) => {
    try {
      const response = await deleteEquipment(id);
      if (response.success) {
        setEqms((prevEqms) => prevEqms.filter((eqm) => eqm._id !== id));
        showToast("success", response.message);
      } else {
        showToast("error", response.message);
      }
    } catch (err) {
      showToast("error", "Có lỗi khi xóa thiết bị.");
    }
  };

  return (
    <div className="container flex flex-col">
      {/* Equipment Table */}
      {isLoading ? (
        <div className="flex mt-10 justify-center items-center">
          <HashLoader loading={isLoading} color="#1e293b" size={50} />
        </div>
      ) : (
        <EquipmentTable
          eqms={eqms}
          onSave={handleSaveEqm}
          onDelete={handleDeleteEqm}
        />
      )}

      <Notification />
    </div>
  );
}
