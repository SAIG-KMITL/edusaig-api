import { SetMetadata } from '@nestjs/common';

export const COURSE_OWNERSHIP_KEY = 'courseOwnership' as const;
export const ADMIN_DRAFT_ONLY_KEY = 'adminDraftOnly' as const;


type DecoratorFunction = (
  target: object | Function,
  propertyKey?: string | symbol,
  descriptor?: PropertyDescriptor
) => any;

export const CourseOwnership = (config: {adminDraftOnly?: boolean;} = {}): DecoratorFunction => {
  return (
    target: object | Function,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) => {
    if (config.adminDraftOnly) {
      SetMetadata(ADMIN_DRAFT_ONLY_KEY, true)(target, propertyKey, descriptor);
    }
    return SetMetadata(COURSE_OWNERSHIP_KEY, true)(target, propertyKey, descriptor);
  };
};