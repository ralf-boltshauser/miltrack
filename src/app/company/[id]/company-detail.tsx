"use client";

import AddPersonDialog from "./add-person-dialog";
import { CompanyWithDetails } from "./company-actions";

export default function CompanyDetail({
  company,
}: {
  company: CompanyWithDetails;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>{company.name}</h1>
        <AddPersonDialog company={company} />
      </div>
      <div>
        {company.platoons.map((platoon) => (
          <div key={platoon.id}>
            <h2>{platoon.name}</h2>
            <div>
              {platoon.persons.map((person) => (
                <div key={person.id}>
                  <h3>{person.name}</h3>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
