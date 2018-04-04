import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import Spinner from 'nav-frontend-spinner';

import Intro from './../connected-components/intro/Intro';
import SøknadSendt from './../connected-components/soknad-sendt/SøknadSendt';
import IkkeMyndig from './../connected-components/feilsider/IkkeMyndig';
import ErMann from '../connected-components/feilsider/ErMann';
import PersonFinnesIkke from '../connected-components/feilsider/PersonFinnesIkke';
import InnsendingFeilet from '../connected-components/feilsider/InnsendingFeilet';

import SøknadContainer from './SøknadContainer';
import { erMann, erMyndig, harPersonData } from 'util/validation/validationUtils';

import { apiActionCreators as api } from '../redux/actions';
import { ExternalProps } from '../types';

import { DispatchProps } from '../redux/types';
import Person from '../types/domain/Person';
import { EngangsstonadSoknadResponse } from '../types/services/EngangsstonadSoknadResponse';

import '../styles/engangsstonad.less';

interface StateProps {
    soknad: EngangsstonadSoknadResponse;
    person: Person;
    error: any;
    søknadSendt: boolean;
    godkjentVilkar: boolean;
    language: string;
    søknadSendingInProgress: boolean;
}

type Props = StateProps & ExternalProps & DispatchProps & RouteComponentProps<{}>;

type Error = {
    personFinnes: boolean;
    personErMann?: boolean;
    personErMyndig?: boolean;
    innsendingFeilet?: boolean;
};

export class AppContainer extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        const { dispatch, person, error } = this.props;

        if (error && error.status === 401) {
            return this.redirectToLogin();
        }
        if (!person) {
            dispatch(api.getPerson());
        }

    }

    componentWillReceiveProps(props: any) {
        if (props.error && props.error.status === 401) {
            return this.redirectToLogin();
        }
    }

    redirectToLogin() {
        window.location.href = ((window as any).LOGIN_URL + '?redirect=' + window.location.href);
    }

    renderContent(children: React.ReactNode) {
        return (
            <div className="engangsstonad">
                {children}
            </div>
        );
    }

    getErrorRoutes(error: Error) {
        let component: any;
        if (error.personErMann === true) {
            component = ErMann;
        } else if (error.personFinnes === false) {
            component = PersonFinnesIkke;
        } else if (error.personErMyndig === false) {
            component = IkkeMyndig;
        } else if (error.innsendingFeilet === true) {
            component = InnsendingFeilet;
        }

        return (
            <Switch>
                <Route path="/engangsstonad" component={component} />,
                <Redirect to="/engangsstonad" />
            </Switch>
        );
    }

    getSøknadRoutes() {
        const { godkjentVilkar, person, søknadSendt } = this.props;
        return (
            <Switch>
                <Route path="/engangsstonad" component={Intro} exact={true} />
                {person && søknadSendt && <Route path="/engangsstonad/completed" component={SøknadSendt} />}
                {godkjentVilkar === true && <Route path="/engangsstonad/soknad" component={SøknadContainer} />}
                <Redirect to="/engangsstonad" />
            </Switch>
        );
    }

    render() {
        const { person, søknadSendt, error } = this.props;

        if (!person && !error) {
            return this.renderContent(this.getErrorRoutes({ personFinnes: false }));
        }

        if (person) {
            const personFinnes = harPersonData(person);
            const personErMyndig = erMyndig(person);
            const personErMann = erMann(person);
            const innsendingFeilet = søknadSendt && error && error.status !== 401 && error.status >= 400;
            const applicationStateIsValid = personFinnes && personErMyndig && !personErMann && !innsendingFeilet;

            if (applicationStateIsValid) {
                return this.renderContent(this.getSøknadRoutes());
            }

            return this.renderContent(
                this.getErrorRoutes({
                    personErMann,
                    personFinnes,
                    personErMyndig,
                    innsendingFeilet
                })
            );
        }

        return this.renderContent(<Spinner type="XXL"/>);
    }
}

const mapStateToProps = (state: any) => ({
    error: state.apiReducer.error,
    person: state.apiReducer.person,
    soknad: state.apiReducer.soknad,
    søknadSendt: state.apiReducer.søknadSendt,
    søknadSendingInProgress: state.apiReducer.søknadSendingInProgress,
    godkjentVilkar: state.commonReducer.godkjentVilkar,
    language: state.commonReducer.language
});

export default withRouter(connect<StateProps, {}, {}>(mapStateToProps)(AppContainer));
