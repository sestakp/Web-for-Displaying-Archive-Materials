import React, { useEffect } from "react";
import ArchivalCategoryCard from "../../components/archivalCategoryCard/archivalCategoryCard";
import categories from "../../configs/categories";
import { Col, Container, Row } from "react-bootstrap";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";
const Home: React.FC = () => {

	const archivalRecordActions = useArchivalRecordActions()

	useEffect(() => {
		archivalRecordActions.setTypeOfRecord(TypeOfRecordEnum.UNSET);
	},[])

	return (
		<>
		
		<Container>
			<Row>
				{categories.map((category) => (
					<Col xl={4} md={6} key={category.name} className={`p-2`}>
						<ArchivalCategoryCard archivalCategory={category} />
					</Col>
				))}
			</Row>
		</Container>
		</>
	)
}

export default Home;