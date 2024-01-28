'use client'

import React, { useState, useTransition } from 'react'

import { editProfile } from '@/actions/editProfile'
import { Spinner } from '@/app/components/Spinner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { useCurrentUser } from '@/hooks/useCurrent'
import {
  EditProfileFormInput,
  editProfileSchema,
} from '@/types/schemas/editProfileShema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'
import { ChevronRight } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

const editProfileStyles = tv({
  slots: {
    profileBtn: '',
    content: 'overflow-auto',
    title: 'text-xl font-bold',
    form: 'mt-4 gap-4',
    radioWrapper: 'space-y-2',
    radioControl: 'space-y-4',
    radioGroup: '',
    adminFormItem: '',
    userFormItem: 'justify-start',
    radioContentWrapper: 'flex-col',
    radioLabel: 'font-normal',
    radioDescription: 'text-sm text-muted-foreground',
    switchFromItem: 'flex-row justify-between rounded-lg',
    switchText: 'space-y-0.5',
    switchBtnWrapper: 'justify-end',
    switchBtn: 'w-fit',
    spinner: 'mr-2 h-4 w-4 animate-spin',
  },
  compoundSlots: [
    { slots: ['profileBtn', 'radioContentWrapper'], class: 'gap-2' },
    { slots: ['form', 'radioGroup'], class: 'grid' },
    {
      slots: [
        'adminFormItem',
        'userFormItem',
        'radioContentWrapper',
        'switchFromItem',
        'switchBtnWrapper',
      ],
      class: 'flex',
    },
    { slots: ['adminFormItem', 'userFormItem'], class: 'space-x-3 space-y-0' },
    {
      slots: ['adminFormItem', 'userFormItem', 'switchFromItem'],
      class: 'items-center',
    },
  ],
})

export const EditProfileSheet = () => {
  const {
    profileBtn,
    content,
    title,
    form,
    radioWrapper,
    radioControl,
    radioGroup,
    adminFormItem,
    userFormItem,
    radioContentWrapper,
    radioLabel,
    radioDescription,
    switchFromItem,
    switchText,
    switchBtnWrapper,
    switchBtn,
    spinner,
  } = editProfileStyles()

  const user = useCurrentUser()

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const editProfileForm = useForm<EditProfileFormInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  })

  const onSubmit: SubmitHandler<EditProfileFormInput> = async (data) => {
    startTransition(async () => {
      try {
        const result = await editProfile(data)

        if (result.isSuccess) {
          toast.success(result.message)
          setIsOpen(result.data.isOpenSheet)
        } else {
          toast.error(result.error.message)
        }
      } catch (error) {
        console.error(error)
        toast.error('エラーが発生しました。')
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild={true}>
        <Button variant={'ghost'} className={profileBtn()}>
          プロフィールを編集
          <ChevronRight size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className={content()}>
        <SheetHeader>
          <SheetTitle className={title()}>プロフィールを編集</SheetTitle>
          <SheetDescription>
            プロフィールを編集することができます。
          </SheetDescription>
        </SheetHeader>
        <Form {...editProfileForm}>
          <form
            className={form()}
            onSubmit={(...arg) =>
              void editProfileForm.handleSubmit(onSubmit)(...arg)
            }
          >
            <FormField
              control={editProfileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="nickname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={editProfileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={editProfileForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在のパスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editProfileForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しいパスワード</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={editProfileForm.control}
              name="role"
              render={({ field }) => {
                return (
                  <FormItem className={radioWrapper()}>
                    <FormLabel>権限</FormLabel>
                    <FormControl className={radioControl()}>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className={radioGroup()}
                      >
                        <FormItem className={adminFormItem()}>
                          <FormControl>
                            <RadioGroupItem value={UserRole.ADMIN} />
                          </FormControl>
                          <div className={radioContentWrapper()}>
                            <FormLabel className={radioLabel()}>
                              管理者
                            </FormLabel>
                            <FormDescription className={radioDescription()}>
                              管理者は全ての権限を持っています。
                            </FormDescription>
                          </div>
                        </FormItem>
                        <FormItem className={userFormItem()}>
                          <FormControl>
                            <RadioGroupItem value={UserRole.USER} />
                          </FormControl>
                          <div className={radioContentWrapper()}>
                            <FormLabel className={radioLabel()}>
                              ユーザー
                            </FormLabel>
                            <FormDescription className={radioDescription()}>
                              ユーザーは一部の権限を持っています。
                            </FormDescription>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {user?.isOauth === false && (
              <>
                <Separator />
                <FormField
                  control={editProfileForm.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className={switchFromItem()}>
                      <div className={switchText()}>
                        <FormLabel>二段階認証(OTP)</FormLabel>
                        <FormDescription>
                          二段階認証を有効にすると、ログイン時にOTPが必要になります。
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className={switchBtnWrapper()}>
              <Button
                disabled={isPending}
                type="submit"
                className={switchBtn()}
              >
                {isPending && <Spinner className={spinner()} />}
                変更を保存
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
