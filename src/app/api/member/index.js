import connectToDB from "@/database";
import mongoMiddleware from "@/middleware/mongodb";
import Member from "@/models/member";
import { messages } from "@/utils/message";
import Joi from "joi";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().required(),
  birth: Joi.date().required(),
  phone: Joi.string()
    .pattern(/^[0]\d{9}$/)
    .required(),
  address: Joi.string().required(),
  membershipPlanId: Joi.string().optional(),
  status: Joi.string().required(),
  expiredDate: Joi.date().required(),
});

export const dynamic = "force-dynamic";

export async function handler(req, res) {
  console.log(req.method, 'req method');
  
  switch (req.method) {
    case "POST": /// create new member
      const {
        name,
        birth,
        phone,
        address,
        membershipPlanId,
        status,
        expiredDate,
      } = await req.json();

      const { error } = schema.validate({
        name,
        birth,
        phone,
        address,
        membershipPlanId,
        status,
        expiredDate,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      try {
        const memberExist = await Member.findOne({ phone });
        if (memberExist) {
          return NextResponse.json({
            success: false,
            message: messages.addMember.MEMBER_EXIST,
          });
        } else {
          const newMember = await Member.create({
            name,
            birth,
            phone,
            address,
            membershipPlanId,
            status,
            expiredDate,
          });

          if (newMember) {
            return NextResponse.json({
              success: true,
              message: messages.addMember.SUCCESS,
            });
          }
        }
      } catch (e) {
        return NextResponse.json({
          success: false,
          message: messages.addMember.ERROR,
        });
      }
      break;

    case "GET":
      try {
        const allMembers = await Member.find({});
  
        if (allMembers) {
          // return NextResponse.json({
          //   success: true,
          //   data: allMembers,
          // });
          res.status(200).json({ success: true, data: allMembers })
        } else {
          // return NextResponse.json({
          //   success: false,
          //   status: 204,
          //   message: messages.getAllMember.NO_FOUND,
          // });
          res.status(204).json({ success: true, message: messages.getAllMember.NO_FOUND })
        }
      } catch (err) {
        console.log(err);
        // return NextResponse.json({
        //   success: false,
        //   message: messages.getAllMember.ERROR,
        // });
        res.status(500).json({ success: false, message: messages.getAllMember.ERROR });
      }
      break;
    
    default:
      res.status(405).json({ success: false, message: 'Method not allowed hehe' });
      break;
  }

  // if (req.method === "POST") {
  //   /// create new member
  //   const {
  //     name,
  //     birth,
  //     phone,
  //     address,
  //     membershipPlanId,
  //     status,
  //     expiredDate,
  //   } = await req.json();

  //   const { error } = schema.validate({
  //     name,
  //     birth,
  //     phone,
  //     address,
  //     membershipPlanId,
  //     status,
  //     expiredDate,
  //   });

  //   if (error) {
  //     // return NextResponse.json({
  //     //   success: false,
  //     //   message: error.details[0].message,
  //     // });
  //     res.status();
  //   }

  //   try {
  //     const memberExist = await Member.findOne({ phone });
  //     if (memberExist) {
  //       // return NextResponse.json({
  //       //   success: false,
  //       //   message: messages.addMember.MEMBER_EXIST,
  //       // });
  //       res.status(409).json({ error: messages.addMember.MEMBER_EXIST });
  //     } else {
  //       const newMember = await Member.create({
  //         name,
  //         birth,
  //         phone,
  //         address,
  //         membershipPlanId,
  //         status,
  //         expiredDate,
  //       });

  //       if (newMember) {
  //         // return NextResponse.json({
  //         //   success: true,
  //         //   message: messages.addMember.SUCCESS,
  //         // });
  //         res.status(201).json(newMember);
  //       }
  //     }
  //   } catch (e) {
  //     // return NextResponse.json({
  //     //   success: false,
  //     //   message: messages.addMember.ERROR,
  //     // });
  //     res.status(500).json({ error: messages.addMember.ERROR });
  //   }

  //   // } else if (req.method === "GET") { /// get all member
  //   try {
  //     const allMembers = await Member.find({});

  //     if (allMembers) {
  //       return NextResponse.json({
  //         success: true,
  //         data: allMembers,
  //       });
  //     } else {
  //       return NextResponse.json({
  //         success: false,
  //         status: 204,
  //         message: messages.getAllMember.NO_FOUND,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return NextResponse.json({
  //       success: false,
  //       message: messages.getAllMember.ERROR,
  //     });
  //   }

  //   // } else if (req.method === "PUT") { /// update member
  //   //   try {
  //   //     await connectToDB();

  //   //     const {
  //   //       _id,
  //   //       name,
  //   //       birth,
  //   //       phone,
  //   //       address,
  //   //       membershipPlanId,
  //   //       status,
  //   //       expiredDate,
  //   //     } = await req.json();

  //   //     const updateMember = await Member.findOneAndUpdate(
  //   //       { _id: _id },
  //   //       { name, birth, phone, address, membershipPlanId, status, expiredDate },
  //   //       { new: true }
  //   //     );

  //   //     if (updateMember) {
  //   //       return NextResponse.json({
  //   //         success: true,
  //   //         message: messages.updateMember.SUCCESS,
  //   //       });
  //   //     } else {
  //   //       return NextResponse.json({
  //   //         success: false,
  //   //         message: messages.updateMember.ERROR,
  //   //       });
  //   //     }
  //   //   } catch (err) {
  //   //     return NextResponse.json({
  //   //       success: false,
  //   //       message: messages.updateMember.ERROR,
  //   //     });
  //   //   }

  //   // } else if (req.method === "DELETE") { /// delete member
  //   try {
  //     const { searchParams } = new URL(req.url);
  //     const id = searchParams.get("id");

  //     if (!id) {
  //       return NextResponse.json({
  //         success: false,
  //         message: messages.deleteMember.NO_ID,
  //       });
  //     }

  //     const deletedMember = await Member.findByIdAndDelete(id);
  //     if (deletedMember) {
  //       return NextResponse.json({
  //         success: true,
  //         message: messages.deleteMember.SUCCESS,
  //       });
  //     } else {
  //       return NextResponse.json({
  //         success: false,
  //         message: messages.deleteMember.ERROR,
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return NextResponse.json({
  //       success: false,
  //       message: messages.deleteMember.ERROR,
  //     });
  //   }
  // } else {
    // return NextResponse.json(
    //   { status: 405 },
    //   {
    //     success: false,
    //     message: messages.getAllMember.ERROR,
    //   }
    // );
  //   res.status(500).json({ error: messages.addMember.ERROR });
  // }
}

export default mongoMiddleware(handler);
