import connectToDB from "@/database";
import { authorize } from "@/lib/middleware";
import MembershipPlan from "@/models/membershipPlan";
import { messages } from "@/utils/message";
import { NextResponse } from "next/server";

// update total_member +1
export async function PATCH(req, { params }) {
  const authError = await authorize(req, ["manager", "member"]);
  if (authError) return authError;

  try {
    connectToDB();
    const selectedPlan = await MembershipPlan.findOne({ _id: params.id });
    console.log(selectedPlan, 'selectedPlan');
    
    if (!selectedPlan) {
      return NextResponse.json({
        success: false,
        message: messages.updatePlan.NOT_FOUND,
      }, { status: 404 });
    }

    selectedPlan.total_member = selectedPlan.total_member + 1;
    await selectedPlan.save();

    return NextResponse.json({
      success: true,
      message: messages.updatePlan.SUCCESS,
      data: selectedPlan,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: messages.updatePlan.ERROR,
    }, { status: 500 });
  }
}
