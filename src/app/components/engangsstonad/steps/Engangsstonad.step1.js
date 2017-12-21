import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { SkjemaGruppe, Checkbox } from 'nav-frontend-skjema';
import { Normaltekst, Ingress } from 'nav-frontend-typografi';

import { approveConditions, enableNextButton, disableNextButton } from 'ducks/Engangsstonad.duck';

import DialogBox from 'shared/dialog-box/DialogBox';

export class Step1 extends Component {
    constructor(props) {
        super(props);
        this.shouldNextButtonBeEnabled = this.shouldNextButtonBeEnabled.bind(this);

        if (this.shouldNextButtonBeEnabled(props)) {
            this.props.enableNextButton();
        } else {
            this.props.disableNextButton();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.shouldNextButtonBeEnabled(nextProps)) {
            return this.props.enableNextButton();
        }

        return this.props.disableNextButton();
    }

    shouldNextButtonBeEnabled(props) {
        if (props.approvedConditions) {
            return true;
        }

        return false;
    }

    render() {
        const { approveConditions, approvedConditions } = this.props;

        return (
            <div className="step1">
                <Ingress>
                    Engangsstønad er en skattefri engangssum du kan få for
                    hvert barn du /(føder eller) adopterer, når du ikke har tjent opp rett til foreldrepenger.
                </Ingress>
                <DialogBox type="info">
                    <Normaltekst>
                        Husk att du kan ha rett på foreldrepenger hvis du har hatt inntekt i minst 6 av de 10 siste
                        månedene
                    </Normaltekst>
                    <Link to="/">Les mer her</Link>
                </DialogBox>
                <SkjemaGruppe title="Egenerklæring">
                    <Checkbox
                        name="egenerklaring"
                        className="checkboxFieldWithBackground"
                        label="Jeg er klar over at dersom
                            jeg gir uriktige opplysninger eller holder
                            tilbake opplysninger som har betydning for
                            min rett til engangsstønad kan pengene holdes
                            tilbake eller kreves tilbake, og det kan eventuelt
                            medføre straffeansvar."
                        onChange={approveConditions}
                        checked={approvedConditions}
                    />
                </SkjemaGruppe>
            </div>
        );
    }
}

Step1.propTypes = {
    approveConditions: PropTypes.func.isRequired,
    enableNextButton: PropTypes.func.isRequired,
    disableNextButton: PropTypes.func.isRequired,
    approvedConditions: PropTypes.bool
};

Step1.defaultProps = {
    approvedConditions: false
};

const mapStateToProps = (state) => ({
    approvedConditions: state.engangsstonadReducer.approvedConditions
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    approveConditions,
    enableNextButton,
    disableNextButton
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
