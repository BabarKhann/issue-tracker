'use client'

import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createIssueSchema } from '@/app/createIssueSchema';

type IssueForm = z.infer<typeof createIssueSchema>

// interface IssueForm {
//   title: string;
//   description: string;
// }

const NewIssuePage = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const router = useRouter();
  const [error, setError] = useState('');

  return (
    <div className='max-w-xl'>
      {error && <Callout.Root color='red' className='mb-3'>
        <Callout.Text>
          {error}
        </Callout.Text>
      </Callout.Root>}
      <form
        className=' space-y-3'
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post('/api/issues', data);
            router.push('/issues');
          } catch (error) {
            console.log(error)
            setError('An unexpected error occurred');
          }
        })}
      >
        <TextField.Root placeholder='Title' {...register('title')} />
        {errors.title && <Text color="red">{errors.title.message}</Text>}
        <Controller
          name='description'
          control={control}
          render={({ field }) => <SimpleMDE placeholder="Description" {...field} />}
        />
        {errors.description && <Text color="red" as='p'>{errors.description.message}</Text>}

        <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default NewIssuePage