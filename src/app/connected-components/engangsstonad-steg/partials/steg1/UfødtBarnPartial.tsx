import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
const { ValidDateInput } = require('./../../../../lib') as any;
import { soknadActionCreators as soknad } from '../../../../redux/actions';
import { default as Barn, UfodtBarn } from '../../../../types/domain/Barn';
import getMessage from 'util/i18n/i18nUtils';
import { DispatchProps } from '../../../../redux/types/index';
import OmTerminbekreftelsen from 'components/modal-content/OmTerminbekreftelsen';
import { erIUke26Pluss3, erMindreEnn3UkerSiden, idagEllerTidligere, utstedtDatoErIUke26 } from 'util/validation/validationUtils';
import AttachmentButton from 'components/attachment/AttachmentButton';
import AttachmentList from 'components/attachment/AttachmentList';
const Modal = require('nav-frontend-modal').default;
import Veilederinfo from './../../../../components/veileder-info/Veilederinfo';

interface StateProps {
    barn: Barn;
    vedlegg: File[];
}

type Props = StateProps & InjectedIntlProps & DispatchProps;

interface State {
    isModalOpen: boolean;
}

const getTermindato = (barn: UfodtBarn): Date | undefined => {
    if (barn && barn.termindato) {
        return new Date(barn.termindato);
    }
    return undefined;
};

const getTerminbekreftelseDato = (barn: UfodtBarn): Date | undefined => {
    if (barn && barn.terminbekreftelseDato) {
        return new Date(barn.terminbekreftelseDato);
    }
    return undefined;
};

export default class UfødtBarnPartial extends React.Component<Props, State> {
    componentWillMount() {
        this.setState({ ...this.state, isModalOpen: false });
    }

    closeTerminbekreftelseModal() {
        this.setState({ isModalOpen: false });
    }

    getTermindatoValidators() {
        const { intl } = this.props;
        const barn = this.props.barn as any;
        return [
            { test: () => barn.termindato, failText: getMessage(intl, 'valideringsfeil.termindato.duMåOppgi') },
            { test: () => barn.termindato !== '', failText: getMessage(intl, 'valideringsfeil.termindato.duMåOppgi') },
            { test: () => erIUke26Pluss3(barn.termindato), failText: getMessage(intl, 'valideringsfeil.termindato.duMåVæreIUke26') },
            {
                test: () => erMindreEnn3UkerSiden(barn.termindato),
                failText: getMessage(intl, 'valideringsfeil.termindato.termindatoKanIkkeVære3UkerFraIdag')
            }
        ];
    }

    getTerminbekreftelseDatoValidators() {
        const { intl } = this.props;
        const barn = this.props.barn as any;
        return [
            { test: () => barn.terminbekreftelseDato, failText: getMessage(intl, 'valideringsfeil.terminbekreftelseDato.duMåOppgi') },
            { test: () => barn.terminbekreftelseDato !== '', failText: getMessage(intl, 'valideringsfeil.terminbekreftelseDato.duMåOppgi') },
            {
                test: () => idagEllerTidligere(barn.terminbekreftelseDato),
                failText: getMessage(intl, 'valideringsfeil.terminbekreftelseDato.måVæreIdagEllerTidligere')
            },
            {
                test: () => utstedtDatoErIUke26(barn.terminbekreftelseDato, barn.termindato),
                failText: getMessage(intl, 'valideringsfeil.terminbekreftelseDato.duMåVæreIUke26')
            }
        ];
    }

    render() {
        const { barn, vedlegg, dispatch, intl } = this.props;
        const { antallBarn } = barn;
        const termindato = getTermindato(barn);
        const terminbekreftelseDato = getTerminbekreftelseDato(barn);

        return (
            <div>
                {antallBarn && (
                    <ValidDateInput
                        id="termindato"
                        name="termindato"
                        dato={termindato}
                        label={getMessage(intl, 'relasjonBarn.text.termindato')}
                        onChange={(dato: Date) => dispatch(soknad.setTermindato(dato ? dato.toISOString() : ''))}
                        validators={this.getTermindatoValidators()}
                    />
                )}

                {termindato && [
                    <Veilederinfo key="veileder">{getMessage(intl, 'terminbekreftelsen.text.terminbekreftelsen')}</Veilederinfo>,
                    <AttachmentButton key="vedlegg" id="vedlegg" onFileSelected={(files: File[]) => dispatch(soknad.addVedlegg(files))} />,
                    <AttachmentList key="vedleggListe" vedlegg={vedlegg} onDeleteClick={(file: File) => dispatch(soknad.deleteVedlegg(file))} />
                ]}

                {vedlegg.length > 0 && (
                    <div key="dateInputTerminBekreftelse">
                        <ValidDateInput
                            id="terminbekreftelse"
                            name="terminbekreftelse"
                            dato={terminbekreftelseDato}
                            label={getMessage(intl, 'relasjonBarn.text.datoTerminbekreftelse')}
                            onChange={(dato: Date) => dispatch(soknad.setTerminbekreftelseDato(dato ? dato.toISOString() : ''))}
                            validators={this.getTerminbekreftelseDatoValidators()}
                        />
                    </div>
                )}
                <Modal
                    isOpen={this.state.isModalOpen}
                    closeButton={true}
                    onRequestClose={() => this.closeTerminbekreftelseModal()}
                    contentLabel="Om terminbekreftelsen"
                >
                    <OmTerminbekreftelsen />
                </Modal>
            </div>
        );
    }
}
