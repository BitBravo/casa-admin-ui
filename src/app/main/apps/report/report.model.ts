import { FuseUtils } from '@fuse/utils';

export class Report {
    id: string;
    email: string;
    name: string;
    report: string;
    updatedAt: string;
    /**
     * Constructor
     *
     * @param report
     */
    constructor(report) {
        this.id = report._id;
        this.name = report.name || '';
        this.email = report.email || '';
        this.updatedAt = report.updatedAt || '';
        this.report = report.report || '';
    }

}
