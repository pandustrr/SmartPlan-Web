import React from "react";
import AffiliateLink from "./AffiliateLink";
import AffiliateTracking from "./AffiliateTracking";
import AffiliateLeads from "./AffiliateLeads";

const Affiliate = ({ activeSubSection }) => {
  const renderComponent = () => {
    switch (activeSubSection) {
      case "affiliate-link":
        return <AffiliateLink />;
      case "affiliate-tracking":
        return <AffiliateTracking />;
      case "affiliate-leads":
        return <AffiliateLeads />;
      default:
        return <AffiliateLink />;
    }
  };

  return <div className="w-full">{renderComponent()}</div>;
};

export default Affiliate;
