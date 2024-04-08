import { AccessibilityIcon } from "@/icons/Accessibility";
import { RightDirectionBulletIcon } from "@/icons/RightDirectionBullet";
import images from "~/assets";
import { CXScoreLogo } from "../../../Sameer/components/atoms/logo/cxscore-logo";
import { HorizontalSeparator } from "../../../Sameer/components/atoms/seperator/horizontal-separator";
import HeadingOne from "../../component/common/headings/HeadingOne";
import HeadingThree from "../../component/common/headings/HeadingThree";
import HeadingTwo from "../../component/common/headings/HeadingTwo";

const AboutUs = () => {
  const benefitsList = [
    "Full application certification",
    "Integrated KB, SR and RWD",
    "VPAT and assurance reports",
    "End-to-end automation, DevOps integrations",
    "AI-guided dedupe, root cause, remediation",
    "Exceeds WCAG 2.0 Level AA for ADA and 508",
  ];
  return (
    <div className="page-break-before flex min-h-[calc(100vh-5vh)] flex-col justify-between bg-white">
      <div className="px-16">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <CXScoreLogo />
            <HeadingOne
              text="Deliver Impactful Customer Experiences with 10X Speed, Savings, and Compliance"
              className="pl-4 text-2xl text-[#545454]"
            />
          </div>
          <AccessibilityIcon size={80} />
        </div>

        <div className="mt-20 px-8">
          <HeadingOne
            text="Accessibility at Scale"
            className="my-10 w-3/4 text-6xl font-extrabold font-[1100]"
          />
          <HeadingOne
            text="with Gen-AI Synthetic Users"
            className="my-10 w-3/4 text-6xl font-extrabold font-[1100]"
          />
          <HeadingOne
            className="text-2xl leading-10 text-[#545454]"
            text="In today’s fast-paced digital economy, companies are facing immense pressure to innovate and release products quickly.
However, delivering accessible experiences at scale has been a significant challenge due to the complex, imprecise, and
manual nature of existing tools that are not tailored to modern product teams. According to WebAIM’s recent research, over
97% of the 1 million websites tested failed to meet WCAG standards, leading to a surge in ADA digital accessibility lawsuits with
over 2,300 cases filed in 2022 alone. As a result, companies must prioritize accessibility compliance to mitigate the growing
risks of lawsuits and regulatory fines. They also have the opportunity to increase revenue by reaching the widest possible
audience and enhance their brand by clearly demonstrating their commitment to accessibility as part of DEI and ESG programs."
          />
        </div>
      </div>
      <div>
        <div className="relative">
          <div className="flex justify-center">
            <figure aria-label="About Us Image">
              <img src={images.aboutUs} width={1000} alt="About Us Image" />
            </figure>
          </div>
          <div className="bg-[#0089D6] px-8 py-4 pt-16">
            <HeadingOne
              text="About CX Score"
              className="py-6 text-2xl text-white"
            />
            <HeadingOne
              text="CX Score is the first AI-powered CXOps platform for modern product teams. Unlike reactive call centers, surveys and analytics, CX Score integrates product design and experience metrics with DevOps to enable the agile delivery of impactful products at scale. Using CX Score, brands can precisely validate all CX requirements, streamline and automate design flows, and create powerful feedback loops that tie CX initiatives to business outcomes. Its Synthetic User AI predicts customer behavior and shares actionable insights across product teams to rapidly synthesize world class experiences. With CX Score, enterprises realize 10X improvements in experience velocity, operational savings, customer engagement, and financial performance."
              className="pb-10 text-2xl text-white"
            />
            <HorizontalSeparator />
            <div className="flex items-center justify-between pt-4 text-white">
              <HeadingTwo text="© Copyright 2023 CX Score Inc. All Rights Reserved" />
              <HeadingTwo text="info@cxscore.ai | cxscore.ai" />
            </div>
          </div>
          <div className="absolute  inset-0 top-1/3 mx-40 flex items-center justify-center">
            <div className="rounded-3xl bg-[#EDF5FF] px-6 py-4">
              <div className="grid grid-cols-3 grid-rows-3 gap-2">
                <div className="row-span-3 flex items-center justify-center">
                  <HeadingOne text="Why CX Score?" className="w-36 text-4xl" />
                </div>
                {benefitsList.map((item) => {
                  return (
                    <div className="col-span-1 row-span-1 flex items-center justify-start">
                      <RightDirectionBulletIcon size={10} />
                      <HeadingThree text={item} className="pl-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
