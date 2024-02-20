import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: initialContents || {},
    });

    const navigate = useNavigate();
    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="orgCode">org Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgCode"}
                    id="orgCode"
                    type="text"
                    isInvalid={Boolean(errors.orgCode)}
                    {...register("orgCode", {
                        required: "orgCode is required.",
                        maxLength: {
                            value: 30,
                            message: "Max length 30 characters",
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgCode?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="orgTranslationShort">org Translation Short</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslationShort"}
                    id="orgTranslationShort"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslationShort)}
                    {...register("orgTranslationShort", {
                        required: "orgTranslationShort is required.",
                        maxLength: {
                            value: 30,
                            message: "Max length 30 characters",
                        },
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslationShort?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="orgTranslation">org Translation Long</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgTranslation"}
                    id="orgTranslation"
                    type="text"
                    isInvalid={Boolean(errors.orgTranslation)}
                    {...register("orgTranslation", {
                        required: "orgTranslation is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgTranslation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="inactive">inactive</Form.Label>
                <Form.Check
                    data-testid={testIdPrefix + "-inactive"}
                    id="inactive"
                    type="checkbox"
                    isInvalid={Boolean(errors.inactive)}
                    {...register("inactive", {
                        required: "inactive state is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.inactive?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid={testIdPrefix + "-submit"}>
                {buttonLabel}
            </Button>
            <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>
        </Form>
    );
}

export default UCSBOrganizationForm;
