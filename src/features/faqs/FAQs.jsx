import React, { useState } from "react"
import redPillMarker from "@/assets/images/redPillMarker.png"
import { faqData } from "../../constants/faqData"
import ProgressBox from "../../components/ProgressBox"
import { fundText } from "../../constants/colors"
import explainer from "../../assets/images/explainer.png"
const AccordionDown = ({ className = "" }) => {
  return (
    <svg
      className={`${className}`}
      width="24"
      height="14"
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.39801 0.133568L0.333007 2.19857L11.9997 13.8652L23.6663 2.19857L21.6013 0.133567L11.9997 9.73523L2.39801 0.133568Z"
        fill="#A3A3A3"
      />
    </svg>
  )
}

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState(null) // Track which FAQ is open

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id) // Open the clicked FAQ, close if already open
  }

  return (
    <div id="accordion-collapse" data-accordion="collapse">
      {faqData.map((faq, index) => (
        <div className="pb-6 flex  " key={faq.id}>
          <p className="text-xl  text-[#A7A7A7] ">
            <span>{"<"}</span>{" "}
            <span className="inline-block px-1">
              {index < 9 ? "0" + (index + 1) : index + 1}
            </span>{" "}
            <span>{">"}</span>
          </p>
          <div className="flex-1">
            <h2 id={`accordion-collapse-heading-${faq.id}`}>
              <button
                type="button"
                className={`flex items-center justify-between w-full px-5 font-medium rtl:text-right   ${
                  openFaq === faq.id ? "rounded-t-xl" : ""
                }      gap-1`}
                aria-expanded={openFaq === faq.id}
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="text-xl text-left font-medium text-[#fff] ">
                  {faq.question}
                </span>

                <AccordionDown
                  className={` shrink-0 transform ${
                    openFaq === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h2>
            {openFaq === faq.id && (
              <div id={`accordion-collapse-body-${faq.id}`} className="px-5 ">
                {faq.answer.map((paragraph, index) => (
                  <div key={index} className="mb-2 text-[#CDCDCD] ">
                    {paragraph}
                    {faq.links && faq.links[index] && (
                      <p>
                        {" "}
                        <a
                          href={faq.links[index].href}
                          target="_blank"
                          className="text-foundryBlue  hover:underline"
                        >
                          {faq.links[index].text}
                        </a>
                      </p>
                    )}
                    {faq.imagesData && (
                      <div className="flex items-center  justify-between">
                        <img src={explainer} alt="explainer-image" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FAQs
