import React from "react";

const ProfessionalExperience = ({ data }) => {
	const { title, experiences } = data;

	return (
		<section>
			<h2 className='mb-6'>{title}</h2>
			<div className='flex flex-col gap-6'>
				{experiences.map(({ role, description, current }) => (
					<div key={role} className='flex flex-col rounded-lg'>
						<span className={`h-2 ${current ? "bg-green" : "bg-grey"}`} />
						<div className='bg-grey-light p-6 drop-shadow-md'>
							<h3>{role}</h3>
							{/* Render the description with HTML line breaks */}
							<p className='mt-2 text-left' dangerouslySetInnerHTML={{ __html: description }} />
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default ProfessionalExperience;
