/* eslint-disable @typescript-eslint/no-explicit-any */

export const StepSend: React.FC<{
    stepData: any;
    setStepData: (data: any) => void;
}> = ({ stepData, setStepData }) => {
    return (
        <div>
            <input
                type="email"
                className="w-full p-2 border rounded mt-2"
                placeholder="Enter your email"
                value={stepData?.email || ''}
                onChange={(e) => setStepData({ email: e.target.value })}
            />
        </div>
    );
};
