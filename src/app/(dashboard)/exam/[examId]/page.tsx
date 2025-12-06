import { getMockExamById } from '../actions';
import { notFound } from 'next/navigation';
import ExamSession from './ExamSession';
import { Breadcrumb } from '../../../../components/Breadcrumb';

interface ExamDetailPageProps {
    params: Promise<{ examId: string }>;
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
    const { examId } = await params;
    const examIdNum = parseInt(examId, 10);

    if (isNaN(examIdNum)) {
        notFound();
    }

    const { exam, error } = await getMockExamById(examIdNum);

    if (error || !exam) {
        notFound();
    }

    return (
        <div>
            <Breadcrumb items={[
                { label: 'Mock Exams', href: '/exam' },
                { label: exam.title },
            ]} />
            <ExamSession exam={exam} />
        </div>
    );
}
