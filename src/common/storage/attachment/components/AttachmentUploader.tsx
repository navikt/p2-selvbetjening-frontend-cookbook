import * as React from 'react';
import { Attachment, AttachmentType, Skjemanummer } from 'common/storage/attachment/types/Attachment';
import AttachmentOverview from 'common/storage/attachment/components/AttachmentOverview';
import AttachmentApi from 'common/storage/api/attachmentApi';

export interface AttachmentsUploaderProps {
    attachments: Attachment[];
    attachmentType: AttachmentType;
    skjemanummer: Skjemanummer;
    onFilesUploadStart: (attachments: Attachment[]) => void;
    onFileUploadFinish: (attachment: Attachment) => void;
    onFileDeleteStart: (attachment: Attachment) => void;
    onFileDeleteFinish: (attachment: Attachment) => void;
}

export default class AttachmentsUploader extends React.Component<
    AttachmentsUploaderProps
> {
    constructor(props: AttachmentsUploaderProps) {
        super(props);
        this.onFilesSelect = this.onFilesSelect.bind(this);
        this.onFileDelete = this.onFileDelete.bind(this);
    }

    onFilesSelect(files: Attachment[]) {
        const { onFilesUploadStart, onFileUploadFinish } = this.props;
        files.forEach((file: Attachment) => {
            file.pending = true;
        });
        onFilesUploadStart(files);
        files.forEach((file: Attachment) =>
            AttachmentApi.saveAttachment(file).then((response: any) => {
                file.pending = false;
                file.uploaded = true;
                file.url = response.headers.location;
                onFileUploadFinish(file);
            })
        );
    }

    onFileDelete(file: Attachment) {
        const { onFileDeleteStart, onFileDeleteFinish } = this.props;
        file.pending = true;
        onFileDeleteStart(file);
        AttachmentApi.deleteAttachment(file).then(() => {
            onFileDeleteFinish(file);
        });
    }

    render() {
        const { attachments, attachmentType, skjemanummer } = this.props;
        return (
            <AttachmentOverview
                attachments={attachments}
                attachmentType={attachmentType}
                skjemanummer={skjemanummer}
                onFilesSelect={this.onFilesSelect}
                onFileDelete={this.onFileDelete}
            />
        );
    }
}