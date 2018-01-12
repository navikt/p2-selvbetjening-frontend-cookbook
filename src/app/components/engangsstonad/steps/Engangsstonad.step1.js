import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { Normaltekst, Ingress } from 'nav-frontend-typografi';

import ConfirmCheckbox from 'shared/confirmCheckbox/ConfirmCheckbox';
import DialogBox from 'shared/dialog-box/DialogBox';
import { approveConditions } from 'ducks/Engangsstonad.duck';

// eslint-disable-next-line react/prefer-stateless-function
export class Step1 extends Component {
	render() {
		// eslint-disable-next-line no-shadow
		const { approveConditions, approvedConditions } = this.props;

		return (
			<div className="step1">
				<DocumentTitle title="NAV Engangsstønad - Samtykke" />
				<Ingress>
					Engangsstønad er en skattefri engangssum du kan få for hvert barn du
					/(føder eller) adopterer, når du ikke har tjent opp rett til
					foreldrepenger.
				</Ingress>
				<DialogBox type="info">
					<Normaltekst>
						Husk att du kan ha rett på foreldrepenger hvis du har hatt inntekt i
						minst 6 av de 10 siste månedene
					</Normaltekst>
					<Link to="/">Les mer her</Link>
				</DialogBox>
				<ConfirmCheckbox
					name="egenerklaring"
					label="Jeg er klar over at dersom jeg gir uriktige opplysninger eller holder tilbake 
						opplysninger som har betydning for min rett til engangsstønad kan pengene holdes 
						tilbake eller kreves tilbake, og det kan eventuelt medføre straffeansvar."
					onChange={approveConditions}
					checked={approvedConditions}
				/>
			</div>
		);
	}
}

Step1.propTypes = {
	approvedConditions: PropTypes.bool,
	approveConditions: PropTypes.func.isRequired
};

Step1.defaultProps = {
	approvedConditions: false
};

const mapStateToProps = (state) => ({
	approvedConditions: state.engangsstonadReducer.approvedConditions
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			approveConditions
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
